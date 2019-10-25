import { connection } from "../db";
import {LastBlog} from "../../../api/get-last-blog";
import { BlogListItem } from "../../../api/get-blogs-list";

export const getMostRecent = (): Promise<LastBlog> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT alias, content, title FROM blogentry WHERE isHidden = 0 ORDER BY date DESC LIMIT 1",
      (_err, [first], _fields) => {
        const firstBlog = {
            alias: first.alias,
            content: first.content,
            title: first.title
        };
        resolve(firstBlog);
      }
    );
  });
};

// SELECT alias, title, date, bph.photourl from blogentry b
// JOIN blogentryphoto bph ON b.id = bph.BlogEntryId
// ORDER BY b.date DESC

export const getList = (): Promise<BlogListItem[]> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT alias, content, title FROM blogentry WHERE isHidden = 0 ORDER BY date DESC LIMIT 1",
      (_err, [first], _fields) => {
        const firstBlog = {
            alias: first.alias,
            content: first.content,
            title: first.title
        };
        resolve(firstBlog);
      }
    );
  });
}