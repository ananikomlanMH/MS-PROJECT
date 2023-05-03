import formControl from "./libs/FormControl";
import $ from "jquery";
import NotificationToast from "./libs/NotificationToast";
import 'jquery-confirm'
import 'jquery-confirm/css/jquery-confirm.css'
import {InputNumeric} from "./libs/InputNumeric";
import {SelectInput} from "./libs/SelectInput";

const addBox = document.querySelector(".add-box")
const addEnqueteurBtn = document.querySelector(".addEnqueteurBtn")
const modelBox = document.querySelector('.modal__box')
let close__modal = document.querySelectorAll(".close__modal")
const saveProjetBtn = modelBox.querySelector(".saveProjet")
const saveEnqueteurBtn = modelBox.querySelector(".saveEnqueteur")
let isUpdate = false, updateId;

let allProjects = JSON.parse(localStorage.getItem("projets") || "[]")
let allEnqueteurs = JSON.parse(localStorage.getItem("enqueteurs") || "[]")

let currentDate = new Date()

const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
]

const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

window.addEventListener("click", (e) => {
    if (!e.target.matches('.showMenu.fi-rr-menu-dots')) {
        document.querySelectorAll('.settings.show').forEach(elm => {
            if (elm.classList.contains("show")) {
                elm.classList.remove("show");
            }
        });
    }
})

addBox?.addEventListener('click', () => {
    modelBox.classList.add('active')
})

addEnqueteurBtn?.addEventListener('click', () => {
    modelBox.classList.add('active')
})

close__modal.forEach((item) => {
    item.addEventListener('click', () => {
        closeModal()
    })
})

function closeModal() {
    document.querySelector('.modal__box')?.classList.remove('active')
    document.querySelector('.modal__box').querySelectorAll('.field.error').forEach((item) => {
        item.classList.remove("error")
    })
    setTimeout(() => {
        modelBox.querySelector(".modal__header p").innerHTML = modelBox.querySelector(".modal__header p").dataset.title
        document.querySelector('.modal__box form')?.reset()
        modelBox.querySelectorAll(".ss-main .ss-deselect").forEach((item) => {
            item.click()
        })
    }, 500)
}

function showProjets() {
    if (!allProjects) return;
    document.querySelectorAll(".projet").forEach(li => li.remove());
    allProjects.forEach((projet, id) => {
        let enqueteur = allEnqueteurs.filter(e => e.id == projet.enqueteur)[0]

        let filterDesc = projet.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="projet">
                        <div class="details">
                            <p>${projet.projet}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <p>
                                <b>${enqueteur.nom} ${enqueteur.prenom}</b> <br> 
                                ${projet.date}
                            </p>
                            <div class="settings">
                                <i class="showMenu fi-rr-menu-dots"></i>
                                <ul class="menu">
                                    <li data-id="${id}" class="editProjet"><i class="fi-rr-edit"></i>Editer</li>
                                    <li data-id="${id}" class="deleteProjet"><i class="fi-rr-trash"></i>Supprimer</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox?.insertAdjacentHTML("afterend", liTag);
    });

    let showMenu = document.querySelectorAll(".showMenu")
    showMenu.forEach((item) => {
        item.addEventListener('click', (e) => {
            item.parentElement.classList.add('show')
        })
    })

    let editProjet = document.querySelectorAll(".editProjet")
    editProjet.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = item.dataset.id
            let projet = allProjects[id]
            updateId = id;
            isUpdate = true;
            modelBox.querySelector(".modal__header p").innerHTML = "Projet: <span>" + projet.projet + "</span>"
            modelBox.querySelector('#projet').value = projet.projet
            modelBox.querySelector('#description').value = projet.description
            modelBox.querySelector("#projet_enqueteurs option[value='" + projet.enqueteur + "']").setAttribute("selected", '')
            modelBox.classList.add('active')
        })
    })

    let deleteProjet = document.querySelectorAll(".deleteProjet")
    deleteProjet.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = item.dataset.id
            $.confirm({
                icon: 'fa fa-question',
                title: 'Confirmation',
                content: 'Voulez-vous supprimer cet projet ? <br> Ce processus ne peut pas être annulé.',
                useBootstrap: false,
                boxWidth: '500px',
                // autoClose: 'Annuler|10000',
                theme: 'modern',
                closeIcon: true,
                animation: 'scale',
                type: 'red',
                buttons: {
                    Supprimer: {
                        btnClass: 'btn__confirm__delete',
                        action: function () {
                            allProjects.splice(id, 1);
                            localStorage.setItem("projets", JSON.stringify(allProjects));
                            showProjets();
                            NotificationToast('success', 'La ressource a été supprimée avec succès !')
                        }
                    },
                    Annuler: function () {
                    }
                }
            });
        })
    })
}

showProjets();

function showEnqueteurs() {

    if (!allEnqueteurs) return;
    document.querySelectorAll(".enqueteurs").forEach(item => item.remove());
    if (document.querySelector(".empty_row") !== null) {
        if (Object.keys(allEnqueteurs).length > 0) {
            document.querySelector(".empty_row").style.display = "none"
        } else {
            document.querySelector(".empty_row").style.display = " table-row"
        }
    }

    let projet_enqueteurs = document.querySelector("#projet_enqueteurs")

    allEnqueteurs.forEach((enqueteurs, id) => {

        let tr = `
        <tr class="enqueteurs">
                <td class="img">
                    <div><img src="assets/images/favicon.png" alt=""></div>
                </td>
                <td>${enqueteurs.nom}</td>
                <td>${enqueteurs.prenom}</td>
                <td>${enqueteurs.age}</td>
                <td class="d-flex gap-1">
                    <a class="link__table editEnqueteur" data-id="${id}"><i class="fi-rr-edit"></i> Editer</a>
                    <a class="link__table deleteEnqueteur" data-id="${id}"><i class="fi-rr-trash"></i> Supprimer</a>
                </td>
            </tr>
        `;
        document.querySelector(".empty_row")?.insertAdjacentHTML("afterend", tr);


        if (projet_enqueteurs !== null) {
            let option = `
            <option value="${enqueteurs.id}">${enqueteurs.nom} ${enqueteurs.prenom}</option>
            `
            projet_enqueteurs.querySelector("option[data-placeholder='true']")?.insertAdjacentHTML("afterend", option);
        }
    });

    let editEnqueteur = document.querySelectorAll(".editEnqueteur")
    editEnqueteur.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = item.dataset.id
            let enqueteur = allEnqueteurs[id]
            updateId = id;
            isUpdate = true;
            modelBox.querySelector(".modal__header p").innerHTML = "Enqueteur: <span>" + enqueteur.nom + " " + enqueteur.prenom + "</span>"
            modelBox.querySelector('#nom').value = enqueteur.nom
            modelBox.querySelector('#prenom').value = enqueteur.prenom
            modelBox.querySelector('#age').value = enqueteur.age
            modelBox.classList.add('active')
        })
    })


    let deleteEnqueteur = document.querySelectorAll(".deleteEnqueteur")
    deleteEnqueteur.forEach((item) => {
        item.addEventListener('click', (e) => {
            let id = item.dataset.id
            let projet = allProjects.filter(p => p.enqueteur == allEnqueteurs[id].id)
            if (projet.length > 0){
                NotificationToast('error', "Impossible de supprimer la ressource ! Cet enqueteur est relier à <b>"+ projet.length +" projets</b>")
                return 0
            }

            $.confirm({
                icon: 'fa fa-question',
                title: 'Confirmation',
                content: 'Voulez-vous supprimer cet enquêteur ? <br> Ce processus ne peut pas être annulé.',
                useBootstrap: false,
                boxWidth: '500px',
                // autoClose: 'Annuler|10000',
                theme: 'modern',
                closeIcon: true,
                animation: 'scale',
                type: 'red',
                buttons: {
                    Supprimer: {
                        btnClass: 'btn__confirm__delete',
                        action: function () {
                            allEnqueteurs.splice(id, 1);
                            localStorage.setItem("enqueteurs", JSON.stringify(allEnqueteurs));
                            showEnqueteurs();
                            NotificationToast('success', 'La ressource a été supprimée avec succès !')
                        }
                    },
                    Annuler: function () {
                    }
                }
            });
        })
    })

}

showEnqueteurs()

saveProjetBtn?.addEventListener("click", e => {
    let form = modelBox.querySelector('form')
    let control = formControl(form)
    e.preventDefault();
    if (control) {
        let projetName = modelBox.querySelector("#projet")
        let projetDescription = modelBox.querySelector("#description")
        let projetEnqueteur = modelBox.querySelector("#projet_enqueteurs")

        let projet = projetName.value.trim(),
            description = projetDescription.value.trim(),
            enqueteur = projetEnqueteur.value;

        if (projet || description) {
            let currentDate = new Date(),
                month = months[currentDate.getMonth()],
                day = days[currentDate.getDay()],
                date = currentDate.getDate(),
                year = currentDate.getFullYear();


            let projetsInfo = {projet, description, enqueteur, date: `${day} ${date} ${month} ${year}`}

            if (!isUpdate) {
                allProjects.push(projetsInfo);
            } else {
                isUpdate = false;
                allProjects[updateId] = projetsInfo;
            }

            localStorage.setItem("projets", JSON.stringify(allProjects));
            showProjets();
            closeModal()
        }
    }
});

saveEnqueteurBtn?.addEventListener("click", e => {
    let form = modelBox.querySelector('form')
    let control = formControl(form)
    e.preventDefault();
    if (control) {
        let enqueteurName = modelBox.querySelector("#nom")
        let enqueteurSurname = modelBox.querySelector("#prenom")
        let enqueteurAge = modelBox.querySelector("#age")

        let id = Object.keys(allEnqueteurs).length + 1,
            nom = enqueteurName.value.trim(),
            prenom = enqueteurSurname.value.trim(),
            age = enqueteurAge.value;

        if (nom || prenom) {

            let enqueteurInfo = {id, nom, prenom, age}

            if (!isUpdate) {
                allEnqueteurs.push(enqueteurInfo);
            } else {
                isUpdate = false;
                allEnqueteurs[updateId] = enqueteurInfo;
            }

            localStorage.setItem("enqueteurs", JSON.stringify(allEnqueteurs));
            showEnqueteurs();
            closeModal()
        }
    }
});

//Custom Select Input
customElements.define("custom-select", SelectInput, {extends: "select"})
customElements.define("number-format", InputNumeric, {extends: "input"})