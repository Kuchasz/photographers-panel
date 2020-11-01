import {transition, state, trigger, style, animate} from '@angular/animations';

export const animation: any = [
    trigger('imgAnimate', [
        state('fade',
            style({opacity: 1})),
            transition('none => fade', [
                style({
                    opacity: 0
                }),
                animate('0.5s ease-in')
            ])
    ])
];