/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [

    {
        id   : 'inicio',
        title: 'Inicio',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/inicio'
    },

    {
        id   : 'consultiva',
        title: 'Consultiva',
        type : 'collapsable',
        icon : 'heroicons_outline:calendar-days',
        children : [
            {
                id: 'busqueda-clientes',
                title: 'Busqueda Clientes',
                type: 'basic',
                link : 'consultiva/clientes'
            },
        ]
    },

    {
        id: 'retenciones',
        title: 'Retenciones',
        type: 'collapsable',
        icon: 'heroicons_outline:building-office-2',
        children: [
            {
                id: 'busqueda-clientes',
                title: 'Busqueda Clientes',
                type: 'basic',
                link : 'consultiva/clientes'
            },
        ]
    },

    {
        id: 'telemercadeo',
        title: 'Telemercadeo',
        type: 'collapsable',
        icon: 'heroicons_outline:chat-bubble-left-right',
        children: [
            {
                id: 'busqueda-clientes',
                title: 'Busqueda Clientes',
                type: 'basic',
                link : 'consultiva/clientes'
            },
        ]
    }
];
