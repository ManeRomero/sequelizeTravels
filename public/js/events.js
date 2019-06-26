$("[id*=del]").click((e)=> {
    let confirmation = confirm('Estas a punto de eliminar una imagen. ¿Seguro?')

    if(confirmation) {
        let travelId = e.originalEvent.toElement.id
        let id = travelId.substr(travelId.lastIndexOf('-') + 1, travelId.length)
    
        $.ajax({
            url: '/travel/delete/' + id,
            type: 'DELETE',
            success: function(result) {
                console.log(result);
            }
        })
    }
})