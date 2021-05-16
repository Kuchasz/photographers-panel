import { ResultType } from '@pp/api/common';
import { BlogSelectItem, changeMainBlogs, getBlogSelectList, getMainBlogs, MainBlogsDto } from '@pp/api/panel/blog';
// import { getSiteEvents, SiteEventDto } from '@pp/api/panel/site';
import { EventDto, EventType, getEventsList } from '@pp/api/event';
import * as React from 'react';
import {
    Alert,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    HelpBlock,
    Icon,
    List,
    SelectPicker,
} from 'rsuite';
import { FormInstance } from 'rsuite/lib/Form';
import { translations, formatDateTime } from '../../i18n';
import { mainBlogsModel } from './main-blogs-model';
import { colorFromString, invertColor } from "@pp/utils/color";
import './styles.less';

// const styleCenter = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '60px',
// };

// const slimText = {
//     fontSize: '0.666em',
//     color: '#97969B',
//     fontWeight: 'lighter',
//     paddingBottom: 5,
// } as const;

// const titleStyle = {
//     paddingBottom: 5,
//     whiteSpace: 'nowrap',
//     fontWeight: 500,
// } as const;

// const dataStyle = {
//     fontSize: '1.2em',
//     fontWeight: 500,
// };

const getIconForItem = (e: EventDto) => {
    if (e.type === EventType.CalculatorConfigChanged) return 'calculator';

    if (e.type === EventType.PhotoDownloaded || e.type === EventType.PhotoLiked || e.type === EventType.PhotoUnliked)
        return 'image';

    if (e.type === EventType.DisplayRatingRequestScreen || e.type === EventType.NavigatedToRating || e.type === EventType.CloseRatingRequestScreen)
        return 'star-o';

    return 'trophy';
};

const getTitleForItem = (e: EventDto) => {
    if (e.type === EventType.CalculatorConfigChanged) return translations.events.types.calculatorConfigChanged;
    if (e.type === EventType.PhotoDownloaded) return translations.events.types.photoDownloaded;
    if (e.type === EventType.PhotoLiked) return translations.events.types.photoLiked;
    if (e.type === EventType.PhotoUnliked) return translations.events.types.photoUnliked;
    if (e.type === EventType.DisplayRatingRequestScreen) return translations.events.types.displayRatingRequestScreen;
    if (e.type === EventType.NavigatedToRating) return translations.events.types.navigatedToRating;
    if (e.type === EventType.CloseRatingRequestScreen) return translations.events.types.closeRatingRequestScreen;
    
    return '';
};

type Props = {};

const emptyMainBlogs = () => ({
    leftBlog: undefined,
    rightBlog: undefined,
});

export const Dashboard = (props: Props) => {
    const [formState, setFormState] = React.useState<MainBlogsDto>(emptyMainBlogs());
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    // const [events, setEvents] = React.useState<SiteEventDto[]>([]);
    const [newEvents, setNewEvents] = React.useState<EventDto[]>([]);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getMainBlogs().then(setFormState);
    }, []);

    // React.useEffect(() => {
    //     getSiteEvents().then(setEvents);
    // }, []);

    React.useEffect(() => {
        getEventsList().then(setNewEvents);
    }, []);

    const _changeMainBlogs = (b: MainBlogsDto) => {
        setFormState(b);

        if (formRef.current) {
            const formIsValid = formRef.current.check();
            if (!formIsValid) return;
            changeMainBlogs(b).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success(translations.dashboard.mainBlogs.edited);
                } else {
                    Alert.error(translations.dashboard.mainBlogs.notEdited);
                }
            });
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <List bordered className="events" hover>
                {newEvents.map((item, index) => (
                    <List.Item className="event" key={index} index={index + 1}>
                        <span className="avatar" style={{ backgroundColor: colorFromString(item.user), color: invertColor(colorFromString(item.user)) }}>{item.user[0]}</span>
                        <span>
                            <div><Icon icon={getIconForItem(item)}></Icon>{getTitleForItem(item)}</div>
                            <div className="details">{item.user}, {formatDateTime(item.occuredOn)}</div>
                        </span>
                    
                    </List.Item>
                ))}
            </List>
            <Form ref={formRef} model={mainBlogsModel} formValue={formState} onChange={_changeMainBlogs}>
                <FormGroup>
                    <ControlLabel>{translations.dashboard.mainBlogs.leftBlog.label}</ControlLabel>
                    <FormControl
                        name="leftBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="topEnd"
                        searchable={true}
                        data={blogs}
                    />
                    <HelpBlock tooltip>{translations.dashboard.mainBlogs.leftBlog.hint}</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{translations.dashboard.mainBlogs.rightBlog.label}</ControlLabel>
                    <FormControl
                        name="rightBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="topEnd"
                        searchable={true}
                        data={blogs}
                    />
                    <HelpBlock tooltip>{translations.dashboard.mainBlogs.rightBlog.hint}</HelpBlock>
                </FormGroup>
            </Form>
        </div>
    );
};
