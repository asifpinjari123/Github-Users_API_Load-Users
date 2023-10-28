import { useEffect } from "react";
const IsOnline = ({ obj }) => {
    console.log("I Am IsOnline Component");
    let { isOnlineNow, updateIsOnlineOrNot } = obj;
    useEffect(() => {
        window.addEventListener("online", (e) => {
            updateIsOnlineOrNot([true, true]);
            setTimeout(() => updateIsOnlineOrNot([true, false]), 5000);
        });
        window.addEventListener("offline", (e) => {
            updateIsOnlineOrNot([false, true]);
        })
    }, [updateIsOnlineOrNot]);
    return (
        <>
            {isOnlineNow[0] && isOnlineNow[1] && <div className="alert alert-success">Internet Is Connected.</div>}
            {!isOnlineNow[0] && isOnlineNow[1] && <div className="alert alert-warning">You Are Now Offline! Please Check Internet Connection.</div>}
        </>
    )
}
export default IsOnline;