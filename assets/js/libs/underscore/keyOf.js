// Like indexOf but works on objects as well as arrays - return key or null
_.keyOf = function(obj, target) {
    var fkey = null;
    if (obj != null) {
        _.any(obj, function(value, key) {
            if (value === target) {
                fkey = key;
                return true;
            }
            return false;
        });
    }
    return fkey;
};