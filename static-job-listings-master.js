'use strict'; 

$(window).resize(function(){
	//location.reload();
});
const elements = {
	listingsContainer : document.querySelector('.js-job-listings'),
	filters:document.querySelector('.filters'),
	data:{},
	resultsContainer: document.querySelector('.js-results'),
	clear: document.querySelector('.clearstorage'),
}
let vars={
	filterId: 0,
	allSearchTerms:[],
	filterData:[],
	clearBtnAdded: false,
	//filterBtns: [],
}
function saveToStorage(key,arr){
    //whenever the messages are updated , will be saved in local storage.
    localStorage.setItem(key,JSON.stringify(arr));
}
function loadFromStorage(key){
	  let tryget = localStorage.getItem(key);
    if(tryget){
        return JSON.parse(tryget);
		
    }else{ 
        return null;
    }
}
function clearLocalStorage(){
    localStorage.clear();
}





const filterData =()=>{
	
	let included=false;
	//start looping through each job list item to see if the search terms are included in a job list item.
	elements.data.forEach((outeritem)=>{
		included=vars.allSearchTerms.includes(outeritem.role);
		//console.log('item',item.role, 'included',included);
		if(included) {
			//bugfix :remove doubles
	        const isPresent = vars.filterData.includes(outeritem);
			if(isPresent===false){
				vars.filterData.push(outeritem);
			}
			//return included;
		}
		included=vars.allSearchTerms.includes(outeritem.level);
		//console.log('item',item.level, 'included',included);
		if(included) {
			//bugfix :remove doubles
	        const isPresent2 = vars.filterData.includes(outeritem);
			if(isPresent2===false){
				vars.filterData.push(outeritem);
			}
			//return included;
		}
		outeritem.languages.some((item)=>{
           included =vars.allSearchTerms.includes(item);
           if(included) {
			    //bugfix :remove doubles
				const isPresent3 = vars.filterData.includes(outeritem);
				if(isPresent3===false){
					vars.filterData.push(outeritem);
				}
				//return included;
		    }
		});
		outeritem.tools.some((item)=>{
           included=vars.allSearchTerms.includes(item);
           if(included) {
			    const isPresent4 = vars.filterData.includes(outeritem);
				if(isPresent4===false){
					vars.filterData.push(outeritem);
				}
			    // return included;
		   }
		});
	});
	//localStorage.setItem('filtered1xbdeb3df29dxdb',JSON.stringify(vars.filterData));
	saveToStorage('filtered1xbdeb3df29dxdb',vars.filterData);
	
};

const  addListings=(which)=>{
	  //add job listings from json data
	  //const data= (which==='non-filtered') ? elements.data : vars.filterData;
	
	  let data=[];
	  if(which==='filtered1xbdeb3df29dxdb'){
		 //data= JSON.parse(localStorage.getItem('filtered'));
		 data=loadFromStorage('filtered1xbdeb3df29dxdb');
	  } else{ 
		 data= elements.data;
	  }
	  const container = (vars.filterData.length>0) ? elements.resultsContainer : elements.listingsContainer;
	  //clear results/listingsContainer.innerHTML for new reload
	  elements.listingsContainer.innerHTML='';
	  elements.resultsContainer.innerHTML='';
	  //clear filterData for next time the user adds a searchterm, and a new addListings() will be called with new filterdata including the new searchterm results
	  vars.filterData=[];  let array= [];
	  let addFeaturedBorder; let newFont; let featuredFont;
    
	  //console.log(data);
      data.forEach((item,index)=>{
		//some items may not include, featured or new, so add classes based on if they are included or not only.
        addFeaturedBorder = item.featured ? 'addFeaturedBorder' :'';
        newFont = item.new ? 'newFont' : '';
		featuredFont= item.featured ? 'featuredFont' : '';
   
		array.push( `
		    <section class='bg-red ${addFeaturedBorder} display-flex colRow-md justify-content-md-space-between align-items-md-center  '>
				<h3 class='visually-hidden'>${item.company} </h3>
			    <div class='display-flex colRow-md align-items-md-center'>
				        <div class='svg-logo-outer me-2'>
						   <img  loading="lazy" src='${item.logo}' alt='Company logo' class='svg-100 '>
						</div>
						<div class='display-flex direction-column mobile-move-up'>
								<div class='display-flex '>
								    <p class='greenfont fw-semibold p-1'>${item.company} </p>
									<p class='${newFont} text-white rounded-pill p-1 '>${item.new ? 'NEW!' : ''} </p>
									<p class='${featuredFont} text-white rounded-pill p-1'>${item.featured ? 'FEATURED' :''}</p>
								</div>
								<div class='greenfont__hover fw-bold p-1'>
									${item.position}
								</div>
								<div class='display-flex greyfont  borderbottom'>
									<div class='fw-medium me-2 p-1'>${item.postedAt}</div>
									<div class='fw-medium me-2 p-1'>${item.contract}</div>
									<div class='fw-medium p-1'>${item.location}</div>
								</div>
						</div>
				</div>
				<div  role="presentation" class='noborder display-flex align-self-md-center pt-2 p-1'>
					<button  class="search-item lightgreenbg tabBgHover greenfont fw-bold p-1">${item.role}</button>
					<button class="search-item lightgreenbg tabBgHover greenfont fw-bold p-1">${item.level}</button>
					<div class='display-flex'>${item.languages.map(elmt => `
						<button class='search-item lightgreenbg tabBgHover greenfont fw-bold p-1'>${elmt}</button>
					`).join('')}</div>
					<div class='display-flex'>${item.tools.map(elmt => `
						<button class='search-item lightgreenbg tabBgHover fw-bold greenfont p-1'>${elmt}</button>
					`).join('')}</div>
				</div>
		    </section>
	    `);
	  });
	  //container.innerHTML = array.join(' ');
	  $(container).append(array.join(''));
	  addListener(); 
};





//in addlisteners() clearFilters() and addFilter() are called.
//  RemoveFilter() and ClearFilters() are called from addFilter().
const clearFilters=()=>{
	//remove filters
	if($('#header').hasClass('visuallyhidden')===false){
		$('#header').addClass('visuallyhidden');
        $('#header').attr('aria-hidden','true');
	}
	if($('#header').hasClass('filtersPosition')){
		$('#header').removeClass('filtersPosition');
	}
	addListings('non-filtereda3df9sgw3210pkn');
	//remove clear button, I use false/true instead of toggling the boolean variable for clarity and reduces bugs.
	vars.clearBtnAdded=false;
	const clearBtn=document.querySelector('.clearButton');
	if(clearBtn){
		clearBtn.remove();
	}
    //clear filterData for next time the user adds a searchterm, and a new addListings() will be called with new filterdata including the new searchterm results
	vars.filterData=[]; 
	localStorage.clear();
	vars.allSearchTerms=[];
	vars.filterId= 0;
	elements.filters.innerHTML='';
	
}
function addFilter(linktext) {
    const terms1= loadFromStorage('allsearchterms43293n2wsxi8');
	 console.log('addfilter start',vars.allSearchTerms, ' terms in addfilter', terms1);
	//add search terms (to filter results) at top output
	if($('#header').hasClass('visuallyhidden')){ //show filter terms output element
		$('#header').removeClass('visuallyhidden');
		$('#header').attr('aria-hidden','false');
	}
	if($('#header').hasClass('filtersPosition')===false){
		$('#header').addClass('filtersPosition');
	}
	vars.filterId=++vars.filterId;
	const output = `<form class=" greenfont lightgreenbg fw-bold p-1 ms-2 ">
			            <input type='hidden' id='search-term${vars.filterId}' name='search-term${vars.filterId}'>
					    <output name='result' for='search-term${vars.filterId}'>${linktext}<button data-remove-button-id="${vars.filterId}" type='button' class='btn close'><i class="fa-solid fa-square-xmark"></i></button>
						</output>
					</form>`;
	//add the new filter tab 
	elements.filters.insertAdjacentHTML("afterbegin", output );
	//create a clear button element
	const clearBtn=`<button type="button" class="btn clearButton greenfont fw-bold me-2">Clear</button>`;
	if(vars.clearBtnAdded===false){
		//if the clear button has not yet been added, add it to the end of the filter tabs.
		elements.filters.insertAdjacentHTML('beforeend',clearBtn);
		vars.clearBtnAdded=true;
		document.querySelector('.clearButton').addEventListener('click',clearFilters,{once:true});
	}
    
	//add data attribute id value to the last added search term delete button.
	const removeBtn = document.querySelector(`[data-remove-button-id="${vars.filterId}"]`);
	//addeventListener to the last added search term delete button, and only listens once 
	removeBtn.addEventListener('click',removeFilter(linktext), { once: true });

	const terms= loadFromStorage('allsearchterms43293n2wsxi8');
    console.log('addfilter end',vars.allSearchTerms, ' terms in addfilter', terms);
}

const removeFilter =(linktext)=>{
	return function curried_func(e) {
		//delete filter tab at page top output 
		e.currentTarget.parentElement.parentElement.remove();
		//find index of search term in allSearchTerms in order to delete it from array , so its possible to reselect the same term again.
		let indexSearchTerm= vars.allSearchTerms.indexOf(linktext);
	    vars.allSearchTerms.splice(indexSearchTerm,1);
		//update localstorage, bugfix
		saveToStorage('allsearchterms43293n2wsxi8',vars.allSearchTerms);
		//update visible filter listings
		filterData();
		if(vars.allSearchTerms.length>=1){
			addListings('filtered1xbdeb3df29dxdb');
		 }else{
		    clearFilters();
		 }
    }
}
function addListener(){
	//each js added button 142-149 
	[...document.querySelectorAll('.search-item')].forEach(function(item) {
		item.addEventListener('click', function() {
			//vars.filterBtns.push(item);
			//avoid double adds
			const includesTerm= vars.allSearchTerms.includes($(this).text());
            
			if(includesTerm===false){
                vars.allSearchTerms.push($(this).text());
				saveToStorage('allsearchterms43293n2wsxi8',vars.allSearchTerms);
				//is oke, pass the link text to addFilter
				addFilter($(this).text());
			}
			
			filterData();
			console.log('vars serach end',vars.allSearchTerms);
			if(vars.allSearchTerms.length>=1){
			   addListings('filtered1xbdeb3df29dxdb');

			}else{
			   //default non-filtered added for else as a safe fail.
			   //remove clear button, I use false/true instead of toggling the boolean variable for clarity and reduces bugs.
				clearFilters();
			}
		},{once:true}); //once as doubles are not added and search return returns new elements(.search-item)
	});
    
	//loadfromstorage + append
}




//fetch  the initial data after loading is complete
function fetchAsync(){
	fetch("https://raw.githubusercontent.com/cmb347827/static-job-listings/refs/heads/main/data.json")
   .then((response) => response.json())
   .then((data) => {
      elements.data = data;
	  //let datas = JSON.parse(localStorage.getItem('filtered'));
	  let datas= loadFromStorage('filtered1xbdeb3df29dxdb');
	  
	  if(datas){
			addListings('filtered1xbdeb3df29dxdb');
			const terms= loadFromStorage('allsearchterms43293n2wsxi8');
			//bug fix for when I add a new search term and reload.
			vars.allSearchTerms = [...terms];
			terms.forEach((el,index)=>{
				addFilter(el);
			});

	  }else{
		  addListings('non-filtereda3df9sgw3210pkn');
	  }
    });
}

$(window).on('load',function(){
	//clearLocalStorage();
	fetchAsync();
	
	$('#header').attr('aria-hidden','true');

});