/**
 * JAlbum XML Parser Module
 * 
 * This module provides functionality to fetch and parse JAlbum gallery XML files,
 * specifically designed to work with the structure used in wedding photography sites
 * 
 * The function fetches and processes:
 * 1. The main folders.xml file from the root URL
 * 2. Each photos.xml file referenced in folders.xml
 * 3. Compiles all photos into a single flattened array
 * 
 * The structure of JAlbum galleries typically includes:
 * - A root folder with a folders.xml file listing all subdirectories
 * - Each subdirectory containing a photos.xml file with image details
 * - Images stored within these subdirectories
 * 
 * Usage example:
 * ```typescript
 * import { fetchJAlbumPhotos } from './jalbum';
 * 
 * // Example 1: Basic usage
 * fetchJAlbumPhotos('some-url')
 *   .then(photos => {
 *     console.log(`Found ${photos.length} photos across all directories`);
 *     
 *     // Display the first photo
 *     if (photos.length > 0) {
 *       const photo = photos[0];
 *       console.log(`Photo: ${photo.text}`);
 *       console.log(`URL: ${photo.src}`);
 *       console.log(`Thumbnail: ${photo.thumbnail}`);
 *       console.log(`Dimensions: ${photo.width}x${photo.height}`);
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Failed to fetch photos:', error);
 *   });
 * 
 * // Example 2: Group photos by folder
 * fetchJAlbumPhotos('some-url')
 *   .then(photos => {
 *     // Group by folder name
 *     const photosByFolder = photos.reduce((groups, photo) => {
 *       const { folderName } = photo;
 *       groups[folderName] = groups[folderName] || [];
 *       groups[folderName].push(photo);
 *       return groups;
 *     }, {});
 *     
 *     // Display counts for each folder
 *     Object.entries(photosByFolder).forEach(([folder, folderPhotos]) => {
 *       console.log(`${folder}: ${folderPhotos.length} photos`);
 *     });
 *   });
 * ```
 */

import { XMLParser } from 'fast-xml-parser';

/**
 * Represents a photo in the JAlbum XML format
 */
export interface JAlbumPhoto {
  id: string;
  src: string;
  thumbnail: string;
  alt: string;
  text: string;
  width: number;
  height: number;
  path: string;
  folderName: string;
  thumbw: number;
  thumbh: number;
  [key: string]: string | number | boolean;
}

/**
 * Basic interface for parsed XML objects
 */
interface XmlRecord {
  [key: string]: string | number | boolean | XmlRecord | Array<XmlRecord>;
}

/**
 * Fetches and processes JAlbum gallery data from a root URL
 * @param rootUrl The base URL of the JAlbum gallery
 * @returns Promise with a flattened array of photos from all directories
 */
export const fetchJAlbumPhotos = async (rootUrl: string): Promise<JAlbumPhoto[]> => {
  const baseUrl = rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`;
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  
  try {
    // Step 1: Fetch and parse folders.xml
    const foldersResponse = await fetch(`${baseUrl}folders.xml`);
    if (!foldersResponse.ok) {
      throw new Error(`Failed to fetch folders.xml: ${foldersResponse.statusText}`);
    }
    
    const foldersXmlString = await foldersResponse.text();
    const parsedFolders = parser.parse(foldersXmlString) as XmlRecord;
    
    if (!parsedFolders.item || 
        typeof parsedFolders.item !== 'object' || 
        !Array.isArray((parsedFolders.item as XmlRecord).item)) {
      throw new Error('Unexpected folders.xml structure');
    }
    
    // Step 2: Extract directory information that contains photos.xml
    const folderItems = (parsedFolders.item as XmlRecord).item as XmlRecord[];
    
    const directories = folderItems
      .filter((item: XmlRecord) => item.action === 'loadalbum')
      .map((item: XmlRecord) => {
        const path = typeof item.path === 'string' ? item.path : '';
        const name = typeof item.name === 'string' ? item.name : '';
        const variables = typeof item.variables === 'string' ? item.variables : '';
        
        return {
          path,
          name,
          photosXmlPath: variables,
        };
      });
    
    // Step 3: Fetch and process each photos.xml file
    const allPhotos: JAlbumPhoto[] = [];
    
    for (const directory of directories) {
      const photosResponse = await fetch(`${baseUrl}${directory.photosXmlPath}`);
      if (!photosResponse.ok) {
        console.warn(`Failed to fetch ${directory.photosXmlPath}: ${photosResponse.statusText}`);
        continue;
      }
      
      const photosXmlString = await photosResponse.text();
      const parsedPhotos = parser.parse(photosXmlString) as XmlRecord;
      
      if (!parsedPhotos.gallery || 
          typeof parsedPhotos.gallery !== 'object' || 
          !(parsedPhotos.gallery as XmlRecord).image) {
        console.warn(`No images found in ${directory.photosXmlPath}`);
        continue;
      }
      
      const gallery = parsedPhotos.gallery as XmlRecord;
      
      const images = Array.isArray(gallery.image) 
        ? gallery.image as XmlRecord[]
        : [gallery.image as XmlRecord];
      
      for (const img of images) {
        let filename = 'unnamed';
        if (img.img && typeof img.img === 'string') {
          const parts = img.img.split('/');
          if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
              filename = lastPart;
            }
          }
        }
        
        const photo: JAlbumPhoto = {
          id: `${directory.name}_${String(allPhotos.length)}`,
          src: `${baseUrl}${directory.path}${typeof img.img === 'string' ? img.img : ''}`,
          thumbnail: `${baseUrl}${directory.path}${typeof img.thmb === 'string' ? img.thmb : ''}`,
          text: filename,
          alt: filename,
          width: parseInt(typeof img.printwidth === 'string' ? img.printwidth : '0', 10) || 0,
          height: parseInt(typeof img.printheight === 'string' ? img.printheight : '0', 10) || 0,
          path: directory.path,
          folderName: directory.name,
          thumbw: parseInt(typeof img.thumbw === 'string' ? img.thumbw : '0', 10) || 0,
          thumbh: parseInt(typeof img.thumbh === 'string' ? img.thumbh : '0', 10) || 0,
        };
        
        allPhotos.push(photo);
      }
    }
    
    return allPhotos;
    
  } catch (error) {
    console.error('Error fetching JAlbum photos:', error);
    throw error;
  }
};
