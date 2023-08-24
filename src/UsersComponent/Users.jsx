import React, { useState, useEffect } from "react";
import MainTable from "../UsersComponent/Users_Table"; // Replace with your component path

// Function to retrieve data from local storage
const getLocalData = (name) => {
    try {
        let x = localStorage.getItem(name);
        if (x && Array.isArray(JSON.parse(x))) {
            return JSON.parse(x);
        } else {
            return [];
        }
    } catch (err) {
        return [];
    }
};

function Users({ isOnlineNow }) {
    // Component logic
    let [udata, updateUdata] = useState({ message: false });
    let [isLoading, updateLoading] = useState(false);
    let [pagination, updatePagination] = useState({
        page: 1,
        limit: 24,
        showLoadMore: true,
    });
    let [search, updateSearchTerm] = useState("");
    let [onlineStatus] = isOnlineNow;

    // Function to load data based on pagination
    let loadByData = (x) => {
        // Pagination logic
        let { page, limit } = pagination;
        let offset = (page - 1) * limit;
        let total_pages = Math.ceil(x.length / limit);

        // Update pagination based on total pages
        updatePagination((old) => ({
            ...old,
            showLoadMore: page >= total_pages ? false : true,
        }));

        // Load data within the given range
        x = x.slice(0, offset + limit);
        updateUdata(x);
    };

    // Function to load data with pagination
    let loadWithPagination = () => {
        let x = getLocalData("github_users");
        if (x.length > 0) {
            if (search !== "") {
                // Filter data based on search query
                x = x.filter((obj) =>
                    obj.login.match(new RegExp(search, "gi"))
                );
                if (x.length === 0) {
                    // Handle no search results
                    updatePagination((old) => ({ ...old, showLoadMore: false }));
                    updateUdata({ message: "No Search Data Found!" });
                } else {
                    loadByData(x);
                }
            } else {
                loadByData(x);
            }
        } else {
            updateUdata({ message: "No Data Available In Your Storage!" });
        }
    };

    // Function to handle pagination
    let paginate = () => {
        updatePagination((old) => ({ ...old, page: old.page + 1 }));
    };

    // Function to update search query
    let updateSearch = (data) => {
        updateSearchTerm(data);
        updatePagination((old) => ({ ...old, page: 1 }));
    };

    // Function to fetch data
    let getData = () => {
        if (onlineStatus) {
            updateLoading(true);
            fetch(`https://api.github.com/users?per_page=100`)
                .then((data) => data.json())
                .then((data) => {
                    updateLoading(false);
                    if (Array.isArray(data)) {
                        let my_need = data.map((val) => ({
                            id: val.id,
                            login: val.login,
                            avatar_url: val.avatar_url,
                            html_url: val.html_url,
                        }));
                        localStorage.setItem(
                            "github_users",
                            JSON.stringify(my_need)
                        );
                        loadWithPagination();
                    } else {
                        updateUdata({ message: "Something Is Wrong!" });
                    }
                })
                .catch((err) => {
                    updateLoading(false);
                    updateUdata({ message: "Fetch Error Found!" });
                });
        } else {
            loadWithPagination();
        }
    };

    useEffect(() => {
        getData();
    }, [onlineStatus]);

    useEffect(() => {
        updateLoading(true);
        let x = setTimeout(() => {
            updateLoading(false);
            loadWithPagination();
        }, 300);
        return () => clearTimeout(x);
    }, [pagination.page, search]);

    // Render the MainTable component
    return (
        <MainTable
            obj={{
                target: "users",
                udata,
                isLoading,
                search,
                updateSearch,
                paginate,
                pagination,
            }}
        />
    );
}

export default Users;
export { getLocalData };