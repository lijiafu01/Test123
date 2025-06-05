function ResultUnity(actionName) {
    // 檢查 actionName 是否包含 "::"
    const actionParts = actionName.split("::");

    // 若分割後的陣列長度大於 1，使用 [0] 部分；否則，使用原本的 actionName
    const mainAction = actionParts.length > 1 ? actionParts[0] : actionName;

    switch (mainAction) {
        case "Home":
            window.open("http:127.0.0.1", "_blank");
            break;
        case "alert":
            if (actionParts.length > 1) {
                window.alert(actionParts[1]);
            };
        default:
            console.log("unknown mission: " + mainAction);
            break;
    }
}
