export async function skipArray(arr: Array<any>, skipNumber) {
    return arr.filter((x, i) => {
        if (i > skipNumber - 1) {
            return true
        }
    });
}

export async function limitArray(arr: Array<any>, limitNumber: number) {
    return arr.filter((x, i) => {
        if (i <= limitNumber - 1) {
            return true;
        }
    });
}