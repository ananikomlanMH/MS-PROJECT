import $ from 'jquery'
import 'jquery-confirm'
import 'jquery-confirm/css/jquery-confirm.css'
import NotificationToast from "./NotificationToast";
import Turbolinks from "turbolinks";

export function confirmDeleteProjet(formElement) {
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
                action: function() {

                }
            },
            Annuler: function () {
            }
        }
    });
}

export function customAlert(message){
    $.alert({
        icon: 'fa fa-exclamation-triangle',
        title: 'Alert!',
        content: message,
        useBootstrap: false,
        boxWidth: '500px',
        theme: 'material',
        closeIcon: true,
        animation: 'scale',
        type: 'red'
    });
}


export function CustomConfirmLogout(url) {
    $.confirm({
        icon: 'fa fa-question',
        title: 'Confirmation',
        content: 'Voulez-vous vraiment vous déconnectez de votre session utilisateur ? <b>CGP FORMATION</b>',
        useBootstrap: false,
        boxWidth: '500px',
        // autoClose: 'Annuler|10000',
        theme: 'modern',
        closeIcon: true,
        animation: 'scale',
        type: 'red',
        buttons: {
            OUI: {
                btnClass: 'btn__confirm__delete',
                action: function() {
                    fetch(url, {
                        method: "POST",
                    })
                        .then(res => res.json())
                        .then(data => {
                            Turbolinks.visit(data.redirect)
                            document.addEventListener("turbolinks:load", function () {
                                if (data !== undefined) {
                                    NotificationToast(data.type, data.message)
                                    setTimeout(() => { //remove data after 500ms
                                        data = undefined;
                                    }, 500);

                                }

                            })
                        })
                        .catch(err => {
                            NotificationToast("error", "Erreur XHR: " + err)
                        });
                    document.querySelector(".jconfirm.jconfirm-modern.jconfirm-open").remove()
                }
            },
            NON: function () {
            }
        }
    });
}
