const videos = [
    {
        id: '1',
        title: 'Kwintet blaszany z Andrychowa',
        alias: 'rudolf-czerwononosy-renifer-orkiestra-andrychow',
        desc:
            'Członkowie zespołu poprosili nas o nagranie kilku utworów świątecznych w ich wykonaniu. Oto jeden z nich',
        descshort:
            'Członkowie zespołu poprosili nas o nagranie kilku utworów świątecznych w ich wykonaniu. Oto jeden z nich',
        videourl: 'https://www.youtube.com/embed/l7zMLDB-Eac',
        photo: 'kwintet-blaszany-trabka-andrychow.jpg',
        tags: 'orkiestra dęta andrychów, rudolf czerwononosy, występ, na żywo, 5d mk iii, ex1r',
    },
    {
        id: '2',
        title: 'TBD',
        alias: 'TBD',
        desc: 'TBD',
        descshort: 'TBD',
        videourl: 'https://www.youtube.com/embed/U5jF2EBx09s',
        photo: 'TBD',
        tags: 'TBD',
    },
    {
        id: '3',
        title: 'TBD',
        alias: 'TBD',
        desc: 'TBD',
        descshort: 'TBD',
        videourl: 'https://www.youtube.com/embed/ZzyEDE85Kfk',
        photo: 'TBD',
        tags: 'TBD',
    },
    {
        id: '4',
        title: 'TBD',
        alias: 'TBD',
        desc: 'TBD',
        descshort: 'TBD',
        videourl: 'https://www.youtube.com/embed/fue25CrION8',
        photo: 'TBD',
        tags: 'TBD',
    },
    {
        id: '5',
        title: 'TBD',
        alias: 'TBD',
        desc: 'TBD',
        descshort: 'TBD',
        videourl: 'https://www.youtube.com/embed/SFBNPUSLqvk',
        photo: 'TBD',
        tags: 'TBD',
    },
    {
        id: '6',
        title: 'TBD',
        alias: 'TBD',
        desc: 'TBD',
        descshort: 'TBD',
        videourl: 'https://www.youtube.com/embed/ltdE302azjk',
        photo: 'TBD',
        tags: 'TBD',
    },
];

export interface VideoListItem {
    videoUrl: string;
}

export const getVideosList = () => Promise.resolve(videos.map((v) => <VideoListItem>{ videoUrl: v.videourl }));
