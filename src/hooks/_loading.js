export const show = () => {
    const loading = document.getElementById("spinner");
    loading.style.display = "flex";
    return true;
}

export const hide = () => {
    const loading = document.getElementById("spinner");
    loading.style.display = "none";
    return true;
}