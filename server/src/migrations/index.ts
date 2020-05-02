import { run } from "./1-move-blog-images-to-new-directory-schema";
import { run as run2 } from "./2-normalize-blog-tags";
import { run as run3 } from "./3-add-main-asset-to-blog"; 

export const migrations = [run, run2, run3];
