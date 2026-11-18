// Project-specific rules that catch patterns common in low-effort / generated code.
// Each rule encodes a decision this codebase has made, so the reason ships with the error.
import { definePlugin, defineRule } from "vite-plus/lint/plugins";
import type { ESTree } from "vite-plus/lint/plugins";

const MEMO_HOOKS = new Set(["useMemo", "useCallback", "memo"]);
const EFFECT_HOOKS = new Set(["useEffect", "useLayoutEffect"]);

const calleeName = (node: ESTree.CallExpression): string | null =>
  node.callee.type === "Identifier" ? node.callee.name : null;

/** React Compiler is enabled, so hand-written memoization is noise (and often wrong). */
const noManualMemo = defineRule({
  meta: {
    messages: {
      noManualMemo:
        "`{{name}}` is unnecessary: the React Compiler memoizes automatically. Remove it.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "react") return;
        for (const spec of node.specifiers) {
          if (spec.type !== "ImportSpecifier") continue;
          const name = spec.imported.type === "Literal" ? spec.imported.value : spec.imported.name;
          if (MEMO_HOOKS.has(name)) {
            context.report({ node: spec, messageId: "noManualMemo", data: { name } });
          }
        }
      },
      MemberExpression(node) {
        if (node.computed || node.object.type !== "Identifier" || node.object.name !== "React") {
          return;
        }
        if (node.property.type === "Identifier" && MEMO_HOOKS.has(node.property.name)) {
          const name = node.property.name;
          context.report({ node, messageId: "noManualMemo", data: { name } });
        }
      },
    };
  },
});

/** Server state goes through TanStack Query, not ad-hoc fetch-in-effect. */
const noFetchInEffect = defineRule({
  meta: {
    messages: {
      noFetchInEffect:
        "Don't fetch inside useEffect. Use a TanStack Query hook (useQuery/useMutation) for server state.",
    },
  },
  create(context) {
    let effectDepth = 0;
    return {
      CallExpression(node) {
        const name = calleeName(node);
        if (name !== null && EFFECT_HOOKS.has(name)) effectDepth += 1;
        if (name === "fetch" && effectDepth > 0) {
          context.report({ node, messageId: "noFetchInEffect" });
        }
      },
      "CallExpression:exit"(node) {
        const name = calleeName(node);
        if (name !== null && EFFECT_HOOKS.has(name)) effectDepth -= 1;
      },
    };
  },
});

const SLOP_COMMENT_PATTERNS = [
  /\bin a real (app|application|world|implementation|project)\b/i,
  /\.\.\.\s*(rest|existing|other|remaining)\b/i,
  /\b(implement|add) (this|logic|more|it) (here|later)\b/i,
  /\bfor (demo purposes|simplicity|now)\b/i,
  /\byou (can|could|might|may) (also )?(want|need|add|replace)\b/i,
  /\bplaceholder\b/i,
  /\bthis (function|component|hook|method) (is used to|will|does)\b/i,
];

/** Comments should explain why, not narrate or apologize for unfinished work. */
const noSlopComments = defineRule({
  meta: {
    messages: {
      noSlopComment:
        "Comment reads like filler or an unfinished-work note. Delete it, finish the work, or explain *why* instead.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (SLOP_COMMENT_PATTERNS.some((re) => re.test(comment.value))) {
            context.report({ node: comment, messageId: "noSlopComment" });
          }
        }
      },
    };
  },
});

const HEX_COLOR = /#[0-9a-f]{3,8}\b/i;
const STYLING_ATTRS = new Set(["className", "style", "color", "fill", "stroke"]);

/** Store branding comes from theme tokens; a hard-coded color breaks white-labeling. */
const noHardcodedColor = defineRule({
  meta: {
    messages: {
      noHardcodedColor:
        "Hard-coded color in UI code. Use a theme token (e.g. bg-primary / var(--color-primary)) so every store can rebrand it.",
    },
  },
  create(context) {
    const check = (node: ESTree.Node, value: string | null) => {
      if (value !== null && HEX_COLOR.test(value)) {
        context.report({ node, messageId: "noHardcodedColor" });
      }
    };
    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || !STYLING_ATTRS.has(node.name.name)) return;
        const value = node.value;
        if (value?.type === "Literal") check(value, value.value);
        if (
          value?.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ) {
          for (const quasi of value.expression.quasis) check(quasi, quasi.value.cooked);
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: "slop" },
  rules: {
    "no-manual-memo": noManualMemo,
    "no-fetch-in-effect": noFetchInEffect,
    "no-slop-comments": noSlopComments,
    "no-hardcoded-color": noHardcodedColor,
  },
});
