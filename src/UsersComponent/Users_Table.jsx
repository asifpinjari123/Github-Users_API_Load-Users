import React, { useState, useEffect } from "react";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getLocalData } from "../UsersComponent/Users";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import '../UsersComponent/UsersTable.css';

// Toggle the bookmark status of a user
function toggleBookmark(id) {
    let data = getLocalData("github_bkmrk_users");
    let my_need = data.includes(id) ? data.filter(val => val !== id) : [...data, id];
    localStorage.setItem("github_bkmrk_users", JSON.stringify(my_need));
}

// Individual User Card Component
function SingleCard({ obj }) {
    let { updateMtb, bkmrks, val, target } = obj;
    let { id, login, avatar_url, html_url } = val;
    let [isBooked, updateBooked] = useState(bkmrks.includes(id));

    // Toggle bookmark status
    function toggle(id) {
        updateBooked(old => !old);
        toggleBookmark(id);
        if (target === "bookmarks") updateMtb(old => !old);
    }

    // Display only bookmarked users if target is "bookmarks"
    if (target === "bookmarks" && !isBooked) {
        return null;
    }

    return (
        <Card className="card">
            <CardContent>
                <Typography variant="h5" component="div">
                    {login}
                </Typography>
                <Avatar alt={login} src={avatar_url} />
            </CardContent>
            <CardActions>
                <button
                    onClick={() => toggle(id)}
                    title={isBooked ? "remove" : "add"}
                    className={`btn ${isBooked ? "btn-warning" : "btn-primary"}`}
                    type="button"
                >
                    <BookmarkBorderIcon />
                </button>
            </CardActions>
        </Card>
    );
}

// Loading Spinner Component
function Loader() {
    return (
        <Card className="card">
            <CardContent className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </CardContent>
        </Card>
    );
}

// Main List of User Cards Component
function MainCardList({ obj }) {
    let { target, udata, isLoading, search, updateSearch, updateMtb, paginate, pagination } = obj;
    let bkmrks = getLocalData("github_bkmrk_users");
    const [isFetching, setIsFetching] = useState(false);

    // Handle scrolling for fetching more data
    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 500
        ) {
            if (!isFetching && pagination.showLoadMore) {
                setIsFetching(true);
                paginate();
            }
        }
    };

    // Attach scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div id="respo_cards" className="container mt-3">
            <div className="form-group mb-3">
                <label className="form-label">Live Search</label>
                <input
                    onChange={e => updateSearch(e.target.value.trim())}
                    value={search}
                    className="form-control me-2"
                    type="search"
                    placeholder="Live Search"
                    aria-label="Search"
                />
            </div>
            <div className="card-container">
                {isLoading && <Loader />}
                {udata.message && (
                    <Card className="message-card">
                        <CardContent>
                            <Typography>{udata.message}</Typography>
                        </CardContent>
                    </Card>
                )}
                {Array.isArray(udata) && udata.length > 0 && udata.map((val, ind) => (
                    <SingleCard key={val.id} obj={{ updateMtb, bkmrks, val, target }} />
                ))}
            </div>
            {isFetching && (
                <div className="loader-container">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {target === "users" && pagination.showLoadMore && (
                <div className="load-more">
                    <button onClick={paginate} type="button" className="btn btn-light">
                        Load More
                    </button>
                </div>
            )}
            {target === "users" && !pagination.showLoadMore && (
                <div className="no-more-data">
                    <button type="button" className="btn btn-secondary" disabled>
                        No More Data
                    </button>
                </div>
            )}
        </div>
    );
}

export default MainCardList;
