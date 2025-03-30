// Get the current page URL
   var currentPage = window.location.pathname;
  
   // Function to add "fw-bold" class and increase font size for the active nav link
   function setActiveNavLink() {
     let activeLink;
     
     if (currentPage.includes("research.html")) {
       activeLink = document.getElementById("research-link");
     } else if (currentPage.includes("film.html")) {
       activeLink = document.getElementById("film-link");
     } else if (currentPage.includes("AdiJahic_CV.pdf")) {
       activeLink = document.getElementById("cv-link");
     } else {
       activeLink = document.getElementById("home-link");
     }
 
     if (activeLink) {
       activeLink.classList.add("fw-bold");
     }
   }
 
   // Run function when page loads
   setActiveNavLink();

   // Toggle the search bar when the magnifying glass is clicked
   const searchIcon = document.getElementById("search-icon");
   const searchBar = document.getElementById("search-bar");

   searchIcon.addEventListener("click", () => {
       if (searchBar.style.display === "none" || searchBar.style.display === "") {
           searchBar.style.display = "block";
           searchBar.focus();
       } else {
           searchBar.style.display = "none";
           clearSearchResults();
       }
   });

   // Hide the search bar and show the magnifying glass when clicking outside
   searchBar.addEventListener("blur", () => {
       searchBar.style.display = "none";
       clearSearchResults();
   });

   // Clear search results
   function clearSearchResults() {
       const searchResults = document.getElementById("search-results");
       if (searchResults) {
           searchResults.remove();
       }
   }

   // Perform the search dynamically as the user types
   searchBar.addEventListener("input", async () => {
       const query = searchBar.value.toLowerCase();
       const pages = [
           { name: "Home", url: "/" },
           { name: "Research", url: "research.html" },
           { name: "Film", url: "film.html" },
           { name: "CV", url: "AdiJahic_CV.pdf" }, // Include the CV PDF file
           { name: "Risk Sharing...", url: "Jahic_RiskSharingandPortfolioChoice.pdf" } // Example PDF
       ];

       clearSearchResults();

       if (query.trim() === "") {
           return; // Do nothing if the search bar is empty
       }

       const results = [];

       // Search through the pages and PDFs
       for (const page of pages) {
           try {
               if (page.url.endsWith(".pdf")) {
                   // For PDF files, match the query with the name
                   if (page.name.toLowerCase().includes(query)) {
                       results.push(page);
                   }
               } else {
                   // For HTML pages, fetch and search the content
                   const response = await fetch(page.url);
                   const text = await response.text();

                   if (text.toLowerCase().includes(query)) {
                       results.push(page);
                   }
               }
           } catch (error) {
               console.error(`Failed to fetch ${page.url}:`, error);
           }
       }

       // Display results
       if (results.length > 0) {
           const resultLinks = results
               .map(
                   (result) =>
                       `<a href="${result.url}" target="${result.url.endsWith('.pdf') ? '_blank' : '_self'}" class="search-result-link">${result.name}</a>`
               )
               .join("");

           const resultsContainer = `
               <div id="search-results" class="search-results">
                   <p class="search-results-label">Found in:</p>
                   <div class="search-results-links">
                       ${resultLinks}
                   </div>
               </div>`;
           document.body.insertAdjacentHTML("beforeend", resultsContainer);
       }
   });

   // Highlight the searched text on the target page
   function highlightText(query) {
       const elements = document.body.querySelectorAll("*:not(script):not(style)");
       elements.forEach((element) => {
           element.childNodes.forEach((node) => {
               if (node.nodeType === 3) { // Text node
                   const text = node.nodeValue;
                   const regex = new RegExp(`(${query})`, "gi");
                   if (regex.test(text)) {
                       const highlightedText = text.replace(regex, '<span style="background-color: yellow;">$1</span>');
                       const span = document.createElement("span");
                       span.innerHTML = highlightedText;
                       node.replaceWith(span);
                   }
               }
           });
       });
   }

   window.addEventListener("load", () => {
       const urlParams = new URLSearchParams(window.location.search);
       const searchQuery = urlParams.get("search");

       if (searchQuery) {
           highlightText(searchQuery);
       }
   });