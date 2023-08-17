import Login from '../views/UserLogin'
import Admin from "@/views/AdminIndex";
import MainPage from "@/components/MainPage";
import BrandList from "@/components/BrandList";
import CategoryList from "@/components/CategoryList";
import CompanyDetails from "@/components/CompanyDetails";
import ProductList from "@/components/ProductList";


let routes = [
    {
        path:'/admin',
        component: Admin,
        children:[
            { path:'main',component:MainPage },
            { path: 'brand',component: BrandList},
            { path:'category',component: CategoryList },
            { path:'company',component: CompanyDetails},
            { path:'product',component: ProductList},
            { path:'login',component: Login}
        ]
    }

];
export default routes;