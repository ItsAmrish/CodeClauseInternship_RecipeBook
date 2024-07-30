document.addEventListener("DOMContentLoaded", function () {
    const recipeForm = document.getElementById("recipe-form");
    const recentRecipesList = document.getElementById("recent-recipes-list");
    const recipeContainer = document.getElementById("recipe-container");
    const addRecipeBtn = document.getElementById("add-recipe-btn");
    const homeContainer = document.querySelector(".home-container");
    const backBtn1 = document.getElementById("back-btn-1");
    const backBtn2 = document.getElementById("back-btn-2");
    const recipeFormContainer = document.getElementById("recipe-form-container");
    const recipeDetailContainer = document.getElementById("recipe-detail-container");
    const recipeDetail = document.getElementById("recipe-detail");

    loadRecentRecipes();

    addRecipeBtn.addEventListener("click", function () {
        homeContainer.style.display = "none";
        recipeContainer.style.display = "block";
        recipeFormContainer.style.display = "block";
    });

    backBtn1.addEventListener("click", function () {
        recipeContainer.style.display = "none";
        homeContainer.style.display = "block";
    });

    backBtn2.addEventListener("click", function () {
        recipeDetailContainer.style.display = "none";
        homeContainer.style.display = "block";
    });

    recipeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const recipeName = document.getElementById("recipe-name").value;
        const recipeIngredients = document.getElementById("recipe-ingredients").value;
        const recipeSteps = document.getElementById("recipe-steps").value;
        const recipeImage = document.getElementById("recipe-image").files[0];

        if (recipeName && recipeIngredients && recipeSteps && recipeImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 400;
                    canvas.height = 400;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const resizedImage = canvas.toDataURL('image/jpeg');

                    const newRecipe = {
                        name: recipeName,
                        ingredients: recipeIngredients,
                        steps: recipeSteps,
                        image: resizedImage
                    };
                    saveRecipe(newRecipe);
                    clearFormFields(); 
                    loadRecentRecipes();
                    homeContainer.style.display = "block";
                    recipeContainer.style.display = "none";
                };
            };
            reader.readAsDataURL(recipeImage);
        }
    });

    function saveRecipe(recipe) {
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.push(recipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    function loadRecentRecipes() {
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recentRecipesList.innerHTML = "";
        recipes.forEach((recipe, index) => {
            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe");
            recipeElement.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}">
                <div class="recipe-content">
                    <h3>${recipe.name}</h3>
                    <pre>${recipe.ingredients}</pre>
                </div>
                <div class="recipe-tags">
                    <span class="recipe-tag heart-healthy">Heart Healthy</span>
                    <span class="recipe-tag weight-loss">Weight Loss</span>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            recipeElement.addEventListener("click", function () {
                showRecipeDetail(recipe);
            });
            recentRecipesList.appendChild(recipeElement);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function (e) {
                e.stopPropagation(); 
                const index = button.getAttribute("data-index");
                deleteRecipe(index);
            });
        });
    }

    function showRecipeDetail(recipe) {

        const ingredientsList = recipe.ingredients.split('\n').map(ingredient => `<li>${ingredient.trim()}</li>`).join('');
        const stepsList = recipe.steps.split('\n').map(step => `<li>${step.trim()}</li>`).join('');

        recipeDetail.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}" width="400" height="400">
            <div class="recipe-contents">
                <h3>Ingredients</h3>
                <ol id="ingredients-list">
                    ${ingredientsList}
                </ol>
                <h3>Steps</h3>
                <ol id="steps-list">
                    ${stepsList}
                </ol>
            </div>
        `;

        homeContainer.style.display = "none";
        recipeDetailContainer.style.display = "block";
    }

    function deleteRecipe(index) {
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.splice(index, 1); 
        localStorage.setItem("recipes", JSON.stringify(recipes)); 
        loadRecentRecipes(); 
    }

    function clearFormFields() {
        document.getElementById("recipe-name").value = "";
        document.getElementById("recipe-ingredients").value = "";
        document.getElementById("recipe-steps").value = "";
        document.getElementById("recipe-image").value = "";
    }
});
