import SlimSelect from "./SlimSelect/slimselect.min";
import "./SlimSelect/slimselect.min.css"
// import SlimSelect from "slim-select";
export class SelectInput extends HTMLSelectElement {

    connectedCallback() {
        this.select = new SlimSelect({
            select: this,
            settings: {
                searchText: 'Aucun résultat trouvé',
                searchPlaceholder: 'Rechercher',
                searchHighlight: true,
                allowDeselect: true,
            }
        });

        let main = this.parentElement.querySelector(".ss-main")
        if (main !== null) {
            main.addEventListener('focus', (e) => {
                let id = main.id
                if (document.querySelectorAll("#" + id)[1].classList.contains("ss-open-below") === false) {
                    main.click()
                }
            })

            main.addEventListener('mousedown', (e) => {
                e.preventDefault()
            })
        }
    }

    disconnectedCallback() {
        this.select.destroy()
    }
}

export class SelectInputTop extends HTMLSelectElement {

    connectedCallback() {
        this.select = new SlimSelect({
            select: this,
            settings: {
                searchText: 'Aucun résultat trouvé',
                searchPlaceholder: 'Rechercher',
                searchHighlight: true,
                openPosition: 'up'
            }
        });
    }

    disconnectedCallback() {
        this.select.destroy()
    }
}
