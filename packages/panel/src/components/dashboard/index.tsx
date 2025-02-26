import { 
    Form, 
    List, 
    Message, 
    SelectPicker,
    useToaster 
} from 'rsuite';
import { colorFromString, invertColor } from '@pp/utils/dist/color';
import { EventDto, EventType, getEventsList } from '@pp/api/dist/event/event';
import { formatDateTime, translations } from '../../i18n';
import type { FormInstance } from 'rsuite';
import { mainBlogsModel } from './main-blogs-model';
import { ResultType } from '@pp/api/dist/common';
import Avatar from 'boring-avatars';
import { ToolTip } from '../common/tooltip';
import './styles.less';
import {
    BlogSelectItem,
    changeMainBlogs,
    getBlogSelectList,
    getMainBlogs,
    MainBlogsDto,
} from '@pp/api/dist/panel/blog';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { 
    Calculator, 
    Image, 
    Star, 
    Trophy 
} from '@phosphor-icons/react';

const getIconForItem = (e: EventDto) => {
    if (e.type === EventType.CalculatorConfigChanged) return <Calculator size={16} />;

    if (e.type === EventType.PhotoDownloaded || e.type === EventType.PhotoLiked || e.type === EventType.PhotoUnliked)
        return <Image size={16} />;

    if (
        e.type === EventType.DisplayRatingRequestScreen ||
        e.type === EventType.NavigatedToRating ||
        e.type === EventType.CloseRatingRequestScreen
    )
        return <Star size={16} />;

    return <Trophy size={16} />;
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

const getKindForItem = (e: EventDto) => {
    if (e.type === EventType.CalculatorConfigChanged) return 'calculator' as const;
    if (e.type === EventType.PhotoDownloaded) return 'gallery' as const;
    if (e.type === EventType.PhotoLiked) return 'gallery' as const;
    if (e.type === EventType.PhotoUnliked) return 'gallery' as const;
    if (e.type === EventType.DisplayRatingRequestScreen) return 'rating' as const;
    if (e.type === EventType.NavigatedToRating) return 'rating' as const;
    if (e.type === EventType.CloseRatingRequestScreen) return 'rating' as const;

    return '' as const;
};

const getColorForKind = (kind: ReturnType<typeof getKindForItem>) => {
    if (kind === 'gallery') return '#E55381' as const;
    if (kind === 'rating') return '#9B9987' as const;
    if (kind === 'calculator') return '#685762' as const;

    return '#190B28' as const;
};

type Props = {};

const emptyMainBlogs = () => ({
    leftBlog: undefined,
    rightBlog: undefined,
});

export const Dashboard = (props: Props) => {
    console.log('Dashboard');

    const [formState, setFormState] = useState<MainBlogsDto>(emptyMainBlogs());
    const [blogs, setBlogs] = useState<BlogSelectItem[]>([]);
    const [newEvents, setNewEvents] = useState<EventDto[]>([]);
    const [formError, setFormError] = useState({});
    const formRef = useRef<FormInstance>();
    const parentRef = useRef<HTMLDivElement>(null);
    const toaster = useToaster();

    const rowVirtualizer = useVirtualizer({
        count: newEvents.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 48.67,
    });

    useEffect(() => {
        // getBlogSelectList().then(setBlogs);
    }, []);

    useEffect(() => {
        // getMainBlogs().then(setFormState);
    }, []);

    useEffect(() => {
        // getEventsList().then(setNewEvents);
    }, []);

    const _changeMainBlogs = (b: MainBlogsDto) => {
        setFormState(b);

        if (!formRef.current) return;
        
        const formIsValid = formRef.current.check();
        if (!formIsValid) return;

        changeMainBlogs(b).then((result) => {
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.dashboard.mainBlogs.edited}</Message>
                );
            } else {
                toaster.push(
                    <Message type="error">{translations.dashboard.mainBlogs.notEdited}</Message>
                );
            }
        });
    };

    var items = rowVirtualizer.getVirtualItems();

    return (
        <div className="dashboard">
            <div style={{ width: 400, height: '100%' }} ref={parentRef} className="events">
                <div style={{ height: rowVirtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${items[0]?.start}px)`,
                        }}>
                        {items.map((item) => (
                            <div className="event" key={item.index}>
                                <span className="avatar">
                                    <div className="avatar-background">
                                        <Avatar
                                            size={50}
                                            name={newEvents[item.index].user}
                                            variant="marble"
                                            colors={['#3498ff', '#4caf50', '#FFC107']}
                                        />
                                    </div>
                                    {getIconForItem(newEvents[item.index])}
                                </span>
                                <span>
                                    <div className="title">{getTitleForItem(newEvents[item.index])}</div>
                                    <ToolTip text={new Date(newEvents[item.index].occuredOn).toLocaleString()}>
                                        <div className="details middle">
                                            <span>
                                                {newEvents[item.index].user},{' '}
                                                {formatDateTime(newEvents[item.index].occuredOn)}
                                            </span>
                                        </div>
                                    </ToolTip>
                                    <div className="details">
                                        <div
                                            className="chip"
                                            style={{
                                                backgroundColor: getColorForKind(getKindForItem(newEvents[item.index])),
                                            }}>
                                            {getKindForItem(newEvents[item.index])}
                                        </div>
                                    </div>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Form
                style={{ marginLeft: '12px' }}
                ref={formRef as React.Ref<FormInstance>}
                model={mainBlogsModel}
                formValue={formState}
                formError={formError}
                onCheck={setFormError}
                onChange={_changeMainBlogs}>
                <Form.Group>
                    <Form.ControlLabel>{translations.dashboard.mainBlogs.leftBlog.label}</Form.ControlLabel>
                    <Form.Control
                        name="leftBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="bottom"
                        searchable={true}
                        data={blogs}
                    />
                    <Form.HelpText tooltip>{translations.dashboard.mainBlogs.leftBlog.hint}</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>{translations.dashboard.mainBlogs.rightBlog.label}</Form.ControlLabel>
                    <Form.Control
                        name="rightBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="bottom"
                        searchable={true}
                        data={blogs}
                    />
                    <Form.HelpText tooltip>{translations.dashboard.mainBlogs.rightBlog.hint}</Form.HelpText>
                </Form.Group>
            </Form>
        </div>
    );
};
