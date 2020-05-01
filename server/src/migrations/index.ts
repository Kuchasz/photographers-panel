import { run } from "./1-move-blog-images-to-new-directory-schema";
import { run as run2 } from "./2-normalize-blog-tags";

export const migrations = [run, run2];
