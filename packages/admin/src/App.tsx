import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
	useFilteredRoutes,
} from "./route";
import { useMemo } from "react";
import _ from "lodash";

export default function App() {
	const routes = useFilteredRoutes();
	const router = useMemo(() => createBrowserRouter(routes), [routes]);
	return <RouterProvider router={router} />;
}
