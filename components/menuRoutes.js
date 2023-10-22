import {
IdcardOutlined,
BookOutlined,
TeamOutlined,
SwapOutlined
} from '@ant-design/icons'

export const menuRoutes = [
{
    path: 'customer',
    icon: IdcardOutlined,
    title: 'Quản lý khách hàng',
    menuItems: [
        {
            path: '',
            title: '',
            code: '',
            label: ''
        },
        {
            path: '',
            title: '',
            code: '',
            label: ''
        },
        {
            path: '',
            title: '',
            code: '',
            label: ''
        }
    ],
    path: 'loan',
    icon: SwapOutlined,
    title: 'Quản lý mượn trả',
    menuItems: [

    ],
    path: 'book',
    icon: BookOutlined,
    title: 'Quản lý sách',
    menuItems: [

    ],
    path: 'account',
    icon: TeamOutlined,
    title: 'Quản lý tài khoản',
    menuItems: [

    ],

}    
];