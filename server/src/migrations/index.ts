import { run } from "./1-move-blog-images-to-new-directory-schema";
import { run as run2 } from "./2-normalize-blog-tags";
import { run as run3 } from "./3-add-main-asset-to-blog"; 
import { run as run4 } from "./4-remove-news.table"; 
import { run as run5 } from "./5-remove-links-videos-maincontent-privategalleryy"; 

export const migrations = [run, run2, run3, run4, run5];
