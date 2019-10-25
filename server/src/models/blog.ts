import { connection } from "../db";
import { LastBlog } from "../../../api/get-last-blog";
import { BlogListItem } from "../../../api/get-blogs-list";
import { getDateString } from "../../../utils/date";

export const getMostRecent = (): Promise<LastBlog> => {
    return new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT alias, content, title FROM blogentry 
      WHERE isHidden = 0 
      ORDER BY date DESC 
      LIMIT 1`,
            (_err, [first], _fields) => {
                resolve(first);
            }
        );
    });
};

///* <div style="background-image: url('{$base_url}media/images/blog/{$blo->date}/{$blo->blogentryphoto->find()->photourl}')"> */

export const getList = (): Promise<BlogListItem[]> => {
    return new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT be.title, be.date, be.alias, bep.photourl, bep.alttext FROM blogentry be 
      JOIN blogentryphoto bep ON bep.id = (
          SELECT id from blogentryphoto
          WHERE BlogEntryId = be.id
          LIMIT 1)
      WHERE be.isHidden = 0 
      ORDER BY be.date DESC`,
            (_err, blogs, _fields) => {
                const blogListItems = blogs.map((b: any) => ({
                    title: b.title,
                    date: getDateString(new Date(b.date)),
                    alias: b.alias,
                    photoUrl: `http://pyszstudio.pl/media/images/blog/${getDateString(new Date(b.date))}/${b.photourl}`
                }));

                resolve(blogListItems);
            }
        );
    });
};
