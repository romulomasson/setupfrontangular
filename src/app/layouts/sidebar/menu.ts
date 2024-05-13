import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,
        roles: ['Funcionario']
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/',
        roles: ['Empresa']
    },
    {
        id: 3,
        label: 'MENUITEMS.FUNCIONARIOS.TEXT',
        link: '/funcionario/list',
        icon: 'bx bx-user',
        roles: ['Empresa']        
    },
    {
        id: 4,
        label: '',
        link: '/funcionario/edit',
        icon: 'bx bx-user',
        roles: ['Empresa'],
        invisible: true
    },
    {
        id: 5,
        label: '',
        link: '/funcionario/upload',
        icon: 'bx bx-user',
        roles: ['Empresa'],
        invisible: true
    },   
    {
        id: 8,
        isLayout: true
    },
    {
        id: 37,
        label: 'MENUITEMS.EMPRESTIMOS.TEXT',
        icon: 'bx bx-money',
        roles: ['Funcionario'],
        subItems: [
            {
                id: 38,
                label: 'MENUITEMS.EMPRESTIMOS.LIST.MEUSEMPRESTIMOS',
                link: '/emprestimo/list',
                parentId: 37,
                roles: ['Funcionario']
            },
            {
                id: 39,
                label: 'MENUITEMS.EMPRESTIMOS.LIST.SIMULAR',
                link: '/emprestimo/simular',
                parentId: 37,
                roles: ['Funcionario']
            },
            {
                id: 40,
                label: '',
                link: '/emprestimo/contratar',
                parentId: 37,
                roles: ['Funcionario'],
                invisible: true
            }
        ]
    },
];

