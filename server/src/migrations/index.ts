import { run } from "./1-move-blog-images-to-new-directory-schema";
import { run as run2 } from "./2-normalize-blog-tags";
import { run as run3 } from "./3-add-main-asset-to-blog"; 
import { run as run4 } from "./4-remove-news.table"; 
import { run as run5 } from "./5-remove-links-videos-maincontent-privategalleryy"; 
import { run as run6 } from "./6-visits-tables-rework"; 
import { run as run7 } from "./7-blog-entry-id-on-private-gallery"; 
import { run as run8 } from "./8-change-visits-columns-to-date"; 
import { run as run9 } from "./9-rework-private-gallery-tables"; 
import { run as run10 } from "./10-remove-trailing-slashes-from-direct-paths";
import { run as run11 } from "./11-add-notified-to-private-gallery";
import { run as run12 } from "./12-page-visits-to-site-visits"
import { run as run13 } from "./13-add-private-gallery-title";
import { run as run14 } from "./14-enlarge-blog-asset-url"

export const migrations = [run, run2, run3, run4, run5, run6, run7, run8, run9, run10, run11, run12, run13, run14];