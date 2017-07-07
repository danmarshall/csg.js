class Properties {
    _transform(matrix4x4) {
        let result = new Properties();
        Properties.transformObj(this, result, matrix4x4);
        return result;
    }
    _merge(otherproperties) {
        let result = new Properties();
        Properties.cloneObj(this, result);
        Properties.addFrom(result, otherproperties);
        return result;
    }
    static transformObj(source, result, matrix4x4) {
        for (let propertyname in source) {
            if (propertyname === '_transform')
                continue;
            if (propertyname === '_merge')
                continue;
            let propertyvalue = source[propertyname];
            let transformed = propertyvalue;
            if (typeof (propertyvalue) === 'object') {
                if (('transform' in propertyvalue) && (typeof (propertyvalue.transform) === 'function')) {
                    transformed = propertyvalue.transform(matrix4x4);
                }
                else if (propertyvalue instanceof Array) {
                    transformed = [];
                    Properties.transformObj(propertyvalue, transformed, matrix4x4);
                }
                else if (propertyvalue instanceof Properties) {
                    transformed = new Properties();
                    Properties.transformObj(propertyvalue, transformed, matrix4x4);
                }
            }
            result[propertyname] = transformed;
        }
    }
    static cloneObj(source, result) {
        for (let propertyname in source) {
            if (propertyname === '_transform')
                continue;
            if (propertyname === '_merge')
                continue;
            let propertyvalue = source[propertyname];
            let cloned = propertyvalue;
            if (typeof (propertyvalue) === 'object') {
                if (propertyvalue instanceof Array) {
                    cloned = [];
                    for (let i = 0; i < propertyvalue.length; i++) {
                        cloned.push(propertyvalue[i]);
                    }
                }
                else if (propertyvalue instanceof Properties) {
                    cloned = new Properties();
                    Properties.cloneObj(propertyvalue, cloned);
                }
            }
            result[propertyname] = cloned;
        }
    }
    static addFrom(result, otherproperties) {
        for (let propertyname in otherproperties) {
            if (propertyname === '_transform')
                continue;
            if (propertyname === '_merge')
                continue;
            if ((propertyname in result) &&
                (typeof (result[propertyname]) === 'object') &&
                (result[propertyname] instanceof Properties) &&
                (typeof (otherproperties[propertyname]) === 'object') &&
                (otherproperties[propertyname] instanceof Properties)) {
                Properties.addFrom(result[propertyname], otherproperties[propertyname]);
            }
            else if (!(propertyname in result)) {
                result[propertyname] = otherproperties[propertyname];
            }
        }
    }
}
export default Properties;
