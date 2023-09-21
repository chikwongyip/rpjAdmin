import Login from '../views/UserLogin'
import AdminIndex from "@/views/AdminIndex";
import MainPage from "@/components/MainPage";
import BrandList from "@/components/BrandList";
import CategoryList from "@/components/CategoryList";
import CompanyDetails from "@/components/CompanyDetails";
import ProductList from "@/components/ProductList";
import ImageList from "../components/ImageList"
import DocsList from "../components/DocsList"

let routes = [
    {
        path:'/',
        component: AdminIndex,
        children:[
            { path:'main',component:MainPage },
            { path: 'brand',component: BrandList},
            { path:'category',component: CategoryList },
            { path:'company',component: CompanyDetails},
            { path:'product',component: ProductList},
            { path:'image',component: ImageList},
            { path:'docs',component: DocsList }
        ]
    },
    {
        path: '/login',
        component: Login
    }

];
export default routes;