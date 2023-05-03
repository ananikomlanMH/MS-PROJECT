import AutoNumeric from "autonumeric";

let autoNumericOptionsFcfa = {
    digitGroupSeparator        : ' ',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    decimalPlaces              : 0,
    currencySymbolPlacement    : AutoNumeric.options.currencySymbolPlacement.suffix,
    roundingMethod             : AutoNumeric.options.roundingMethod.halfUpSymmetric,
    negativePositiveSignPlacement             : 'p',
    minimumValue: 0,
    maximumValue: 10000000000000
}

export class InputNumeric extends HTMLInputElement{

    connectedCallback(){
        this.type = "text"
        let min = this.dataset.min
        if (min !== undefined) {
            autoNumericOptionsFcfa.minimumValue = min
        }
        let max = this.dataset.max
        if (max !== undefined) {
            autoNumericOptionsFcfa.maximumValue = max
        }

        this.input = new AutoNumeric(this, autoNumericOptionsFcfa);
    }

    disconnectedCallback(){
        this.input.remove()
    }
}


