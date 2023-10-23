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
                path: '/customer/create-new',
                title: 'Create new customer',
                code: 'customerNew',
                label: 'Tạo mới KH'
            },
            {
                path: '/customer/list',
                title: 'List customers',
                code: 'customerList',
                label: 'Danh sách khách hàng'
            },
        ],
        path: 'loan-back',
        icon: SwapOutlined,
        title: 'Quản lý mượn trả',
        menuItems: [
            {
                path: '/loan/create-new',
                title: 'Create new book loan',
                code: 'loanNew',
                label: 'Tạo mới Phiếu Mượn'
            },
            {
                path: '/loan/list',
                title: 'Book loan list',
                code: 'loanList',
                label: 'Danh sách Phiếu Mượn'
            },
            {
                path: '/loan/book-back',
                title: 'Create new book loan',
                code: 'loanNew',
                label: 'Tạo mới Phiếu Mượn'
            },
        ],
        path: 'book',
        icon: BookOutlined,
        title: 'Quản lý sách',
        menuItems: [
            {
                path: '/book/create-new',
                title: 'Create new book',
                code: 'bookNew',
                label: 'Tạo mới thông tin đầu sách'
            },
            {
                path: '/book/list',
                title: 'list book',
                code: 'bookList',
                label: 'Danh sách đầu sách'
            }
        ],
        path: 'account',
        icon: TeamOutlined,
        title: 'Quản lý tài khoản',
        menuItems: [
            {
                title: 'librarian account manager',
                path: 'librarian-account',
                key: 'librarian-account',
                menuItems: [
                    {
                        path: '/librarian-account/create-new',
                        key: '/librarian-account/create-new',
                        title: 'Create librarian-account',
                        label: 'Tạo mới librarian-account',
                        code: 'PP0005',
                    },
                    {
                        path: '/librarian/list',
                        key: '/librarian/list',
                        title: 'List librarian-account',
                        label: 'List librarian-account',
                        code: 'PP0006',
                    },
                ],
            },
            {
                title: 'customer account manager',
                path: 'customer-account',
                key: 'customer-account',
                menuItems: [
                    {
                        path: '/customer-account/create-new',
                        key: '/customer-account/create-new',
                        title: 'Create customer-account',
                        label: 'Create customer-account',
                        code: 'PP0009',
                    },
                    {
                        path: '/customer-account/list',
                        key: '/customer-account/list',
                        title: 'List customer-account',
                        label: 'List customer-account',
                        code: 'PP0009',
                    },
                ],
            },
        ],

    }
];

export const getRouteInfo = route => {
    const getMenuPath = listMenu => {
        if (!listMenu) return null;
        for (const item of listMenu) {
            if (item.path === route) return item;
            const itemMenuPath =
                getMenuPath(item.menuItems) || getMenuPath(item.itemGroup);
            if (itemMenuPath) return itemMenuPath;
        }
        return null;
    };
    return getMenuPath(menuRoutes) || {};
};