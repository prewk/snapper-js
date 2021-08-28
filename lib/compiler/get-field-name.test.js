const get_field_name = require("./get-field-name")
// @ponicode
describe("get_field_name", () => {
    test("0", () => {
        let callFunction = () => {
            get_field_name(["Pierre Edouard", "Pierre Edouard", "Anas", "Jean-Philippe", "Edmond", "Jean-Philippe", "Anas", "Pierre Edouard", "Jean-Philippe", "Edmond", "Pierre Edouard", "Edmond", "Jean-Philippe", "Jean-Philippe", "Edmond", "Edmond", "Edmond", "Pierre Edouard", "Jean-Philippe", "George"], "phone")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            get_field_name(["George", "Michael", "Michael", "Pierre Edouard", "Jean-Philippe", "Anas", "Edmond", "Edmond", "George", "Edmond", "Anas", "Jean-Philippe", "Jean-Philippe", "Pierre Edouard", "Edmond", "George", "Michael", "George", "Pierre Edouard", "Michael"], "token")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            get_field_name(["Edmond", "Michael", "George", "Pierre Edouard", "George", "Michael", "Edmond", "Jean-Philippe", "George", "Jean-Philippe", "George", "Edmond", "Jean-Philippe", "Pierre Edouard", "Michael", "Michael", "Michael", "George", "Pierre Edouard", "Anas"], "group")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            get_field_name(["Pierre Edouard", "Edmond", "George", "Pierre Edouard", "Pierre Edouard", "Michael", "Michael", "George", "Anas", "Edmond", "Edmond", "Michael", "George", "Edmond", "Pierre Edouard", "George", "Michael", "Anas", "Michael", "Michael"], "token")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            get_field_name(["Edmond", "George", "George", "Michael", "Jean-Philippe", "Jean-Philippe", "Pierre Edouard", "Pierre Edouard", "Pierre Edouard", "Jean-Philippe", "Jean-Philippe", "Anas", "George", "Anas", "Michael", "Pierre Edouard", "Michael", "Edmond", "Edmond", "George"], "status")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            get_field_name(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
