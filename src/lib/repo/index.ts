import { getDb } from "@/db/client";
import { SqliteStoreRepository } from "./sqlite";
import type { StoreRepository } from "./types";

let repository: StoreRepository | undefined;

/** The single place that decides which storage backend the app uses. */
export function getRepository(): StoreRepository {
  repository ??= new SqliteStoreRepository(getDb());
  return repository;
}
