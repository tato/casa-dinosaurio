import boardReducer, { deserializeBoard, selectSerializedBoard, updateBackgroundImage } from "./boardSlice"

describe("board reducer", () => {
    const initialState = {
        backgroundImage: "image.png",
    }
    const differentState = {
        backgroundImage: "different.jpg"
    }

    it("should serialize and deserialize", () => {
        const serialized = selectSerializedBoard({ board: differentState })
        expect(boardReducer(initialState, deserializeBoard(serialized))).toEqual(differentState)
      
        const serialized2 = selectSerializedBoard({ board: initialState })
        expect(boardReducer(differentState, deserializeBoard(serialized2))).toEqual(initialState)
    })

    it("should update background image", () => {
        const newFile = "new.jpg"
        expect(boardReducer(initialState, updateBackgroundImage(newFile))).toEqual({
            backgroundImage: newFile
        })
    })
})