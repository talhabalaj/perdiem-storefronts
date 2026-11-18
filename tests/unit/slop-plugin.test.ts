import { describe, it } from "vite-plus/test";
import { RuleTester } from "vite-plus/lint/plugins-dev";
import slop from "../../lint/slop-plugin";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "tsx" } } });
const rule = (name: string) => {
  const found = slop.rules[name];
  if (!found) throw new Error(`slop plugin has no rule ${name}`);
  return found;
};

tester.run("no-manual-memo", rule("no-manual-memo"), {
  valid: ['import { useState } from "react";', 'import { useMemo } from "some-lib";'],
  invalid: [
    { code: 'import { useMemo } from "react";', errors: [{ messageId: "noManualMemo" }] },
    {
      code: 'import { memo, useCallback } from "react";',
      errors: [{ messageId: "noManualMemo" }, { messageId: "noManualMemo" }],
    },
    { code: "const x = React.useMemo(() => 1, []);", errors: [{ messageId: "noManualMemo" }] },
  ],
});

tester.run("no-fetch-in-effect", rule("no-fetch-in-effect"), {
  valid: [
    "async function load() { await fetch('/api'); }",
    "useEffect(() => { document.title = 'x'; });",
  ],
  invalid: [
    {
      code: "useEffect(() => { fetch('/api/menu').then(r => r.json()); }, []);",
      errors: [{ messageId: "noFetchInEffect" }],
    },
  ],
});

tester.run("no-slop-comments", rule("no-slop-comments"), {
  valid: ["// Prices are integer cents to avoid float rounding.\nconst a = 1;"],
  invalid: [
    {
      code: "// In a real app this would hit the DB\nconst a = 1;",
      errors: [{ messageId: "noSlopComment" }],
    },
    { code: "// ... rest of the code\nconst a = 1;", errors: [{ messageId: "noSlopComment" }] },
    { code: "/* placeholder image */ const a = 1;", errors: [{ messageId: "noSlopComment" }] },
    {
      code: "// This function is used to add numbers\nconst a = 1;",
      errors: [{ messageId: "noSlopComment" }],
    },
  ],
});

tester.run("no-hardcoded-color", rule("no-hardcoded-color"), {
  valid: ['<div className="bg-primary text-primary-foreground" />', '<a href="#add" />'],
  invalid: [
    { code: '<div className="bg-[#ff0000]" />', errors: [{ messageId: "noHardcodedColor" }] },
    {
      code: "<div className={`p-4 text-[#123abc]`} />",
      errors: [{ messageId: "noHardcodedColor" }],
    },
  ],
});
