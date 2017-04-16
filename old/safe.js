<script>
    var steps = JSON.stringify({{ data['mash'] | tojson }})
    localStorage['steps'] = steps;
    localStorage['recipeLoaded'] = "true"
</script>
<script src="/static/script.js{{ query }}"></script>
