import Ember from 'ember'

const { Helper } = Ember

export function math([lvalue, operator, rvalue]) {
    lvalue = parseFloat(lvalue)
    rvalue = parseFloat(rvalue)
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator]
}

export default Helper.helper(function (params) {
	return math(params)
});
