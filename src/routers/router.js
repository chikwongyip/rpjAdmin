import Login from '../views/UserLogin'
import AdminIndex from "@/views/AdminIndex";
import MainPage from "@/components/MainPage";
import BrandList from "@/components/BrandList";
import CategoryList from "@/components/CategoryList";
import CompanyDetails from "@/components/CompanyDetails";
import ProductList from "@/components/ProductList";
import ImageList from "../components/ImageList"

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
            { path:'image',component: ImageList}
            // { path:'login',component: Login}
        ]
    },
    {
        path: '/login',
        component: Login
    }

];
export default routes;