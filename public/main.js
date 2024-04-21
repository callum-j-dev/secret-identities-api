const deleteButtons = document.querySelectorAll('.delete');

deleteButtons.forEach(deleteButton => deleteButton.addEventListener('click', deleteSuperhero))

async function deleteSuperhero() {
    console.log('trying to delete');
    const superheroName = this.parentNode.childNodes[1].innerText;
    const secretIdentity = this.parentNode.childNodes[3].innerText;
    const homeCity = this.parentNode.childNodes[5].innerText;

    try {
        const response = await fetch('/superheroes', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'superheroName': superheroName,
                'secretIdentity': secretIdentity,
                'homeCity': homeCity
            })
        });
        const data = await response.json();
        console.log(data);
        location.reload();
    }
    catch(err) {
        console.log(err);
    }
}