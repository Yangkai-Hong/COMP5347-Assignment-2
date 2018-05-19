google.charts.load('current', {packages: ['corechart']});

var options1 = {'title':'Revision number distribution by year and by user type',
		'width':400,
		'height':300};

var options2 = {'title':'Revision number distribution by user type',
		'width':400,
		'height':300};

var options3 = {'title':'Revision number distribution by year made by ',
		'width':800,
		'height':600};

var overallData
var articleData
var chart3Data
var articles
var showTop5Checkbox = false;
var top5
var articleTitle

// show most/least revisions functions
var revNum = 3;
function showMostRevs() {
    var mostRevisions = new Array();
    $.getJSON('/mostRevisions',function(result) {
    	for (i=0;i<revNum;i++){
            mostRevisions.push(result[i]['_id']+", ");
		}
        $('#mostRevs').html(mostRevisions);
    });
}
function showLeastRevs() {
    var leastRevisions = new Array();
    $.getJSON('/leastRevisions',function(result) {
        for (i=0;i<revNum;i++){
            leastRevisions.push(result[i]['_id']+", ");
        }
        $('#leastRevs').html(leastRevisions);
    });
}

// show largest/smallest group functions
var gpNum = 1;
function showLargeGp(){
	var largeGp = new Array();
	$.getJSON('/largestGroup',function(result){
		for (i=0;i<gpNum;i++){
			largeGp.push(result[i]['_id']+", ");
		}
		$('#largeGp').html(largeGp);
	});
}
function showSmallGp(){
    var smallGp = new Array();
    $.getJSON('/smallestGroup',function(result){
        for (i=0;i<gpNum;i++){
            smallGp.push(result[i]['_id']+", ");
        }
        $('#smallGp').html(smallGp);
    });
}

// show longest/shortest history functions
var longNum = 3;
var shortNum =1;
function showLongHis(){
	var longHis = new Array();
	$.getJSON('/longestHistory',function (result) {
		for (i=0;i<longNum;i++){
			longHis.push(result[i]['_id']+", ");
		}
		$('#longHis').html(longHis);
    })
}
function showShortHis(){
    var shortHis = new Array();
    $.getJSON('/shortestHistory',function (result) {
        for (i=0;i<shortNum;i++){
            shortHis.push(result[i]['_id']+", ");
        }
        $('#shortHis').html(shortHis);
    })
}

// draw google charts
function drawColumnChart(title){
    var option = options1;
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'Administrator');
    graphData.addColumn('number', 'Anonymous');
    graphData.addColumn('number', 'Bot');
    graphData.addColumn('number', 'Regular user');
    // draw overall column chart
    if (title == null) {
        $.each(overallData, function (index, value) {
            graphData.addRow([value['Year'], value['Administrator'], value['Anonymous'], value['Bot'], value['Regular_user']]);
            //console.log([key,val]);
        })
        var chart = new google.visualization.ColumnChart($("#overallChart")[0]);
    }
    //draw individual article chart
    else {
        //console.log('draw individual article');
        option['title'] += ' for article '
        option['title'] += title
        $.each(articleData,function (index, val) {
            graphData.addRow([val['year'],val['admin'],val['anon'],val['bot'],val['user']]);
        })
        var chart = new google.visualization.ColumnChart($('#IndividualChart')[0]);
    }
    chart.draw(graphData, option);
}
function drawPieChart(title){
	var adminNum = 0;
	var anonNum = 0;
 	var botNum = 0;
	var userNum = 0;
	var option = options2;
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string','User Type');
	graphData.addColumn('number','Percentage');
	if(title == null) {
        $.each(overallData, function (index, value) {
            adminNum += value['Administrator'];
            anonNum += value['Anonymous'];
            botNum += value['Bot'];
            userNum += value['Regular_user'];
        })
        //console.log(adminNum,anonNum,botNum,userNum);
        var chart = new google.visualization.PieChart($("#overallChart")[0]);
    }
    else{
        option['title'] += ' for article '
        option['title'] += title
        $.each(articleData,function(index, val){
            adminNum += val['admin'];
            anonNum += val['anon'];
            botNum += val['bot'];
            userNum += val['user'];
        });
        var chart = new google.visualization.PieChart($('#IndividualChart')[0]);
    }
    graphData.addRow(['Administrator', adminNum]);
    graphData.addRow(['Anonymous', anonNum]);
    graphData.addRow(['Bot', botNum]);
    graphData.addRow(['Regular user', userNum]);
	chart.draw(graphData,option);
}

function drawColumnChartTop5(users, title){
	var option = options3;
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string','year');
	for (i=0;i<users.length;i++){
	    graphData.addColumn('number',users[i]);
        option['title'] += (users[i]+', ')
    }
	option['title'] += 'for Article '
	option['title'] += articleTitle
    var rowNum = chart3Data.length/users.length;
	console.log(rowNum);
    graphData.addRows(rowNum);
    for (i=0;i<users.length;i++) {
        $.each(chart3Data, function (index, val) {
            if (users[i]==val['user']){
                graphData.setCell(index-i*rowNum,0,val['year'].toString());
                graphData.setCell(index-i*rowNum,i+1,val['revNum']);
            }
        })
    }
    var chart = new google.visualization.ColumnChart($('#IndividualChart')[0]);
	chart.draw(graphData,option);
}



//************************************************************
//************************************************************
//************************************************************



$(document).ready(function() {
	showMostRevs();
	showLeastRevs();

	showLargeGp();
	showSmallGp();

	showLongHis();
	showShortHis();

	var articlesArray
    var authorsArray

    $.getJSON('/overallChartData',function (result) {
        overallData = result;
        //console.log(overallData);
    })
    $.getJSON('/mostRevisions',function(result) {
        articles = result;
        //console.log(articles);
        articlesArray = new Array();
        for (i=0;i<articles.length;i++) {
            var option = document.createElement('option');
            //option.innerHTML = articles[i]['_id']+" ("+articles[i]['numOfEdits']+" revisions)";
            option.innerHTML = articles[i]['_id'];
            option.value = i;
            $('#articleList').append(option);
            articlesArray.push(articles[i]['_id']);
        }
        $("#titleInput").autocomplete({
            source: articlesArray
        });
    });
    $.getJSON('/authors',function (result) {
        authorsArray = new Array();
        for (i=0;i<result.length;i++){
            authorsArray.push(result[i]['_id']);
        }
        //console.log(authorsArray);
        $("#authorInput").autocomplete({
            minLength:2,
            source: authorsArray
        });
    });

    $('#chartList').bind("change",function(event){
        var obj = $('#chartList');
        chart_name = obj.find("option:selected").text()
        event.preventDefault();
        if(chart_name == 'Select The Chart Type'){
            return
        }
        if (chart_name == 'Piechart'){
        	console.log('drawing pie chart')
            drawPieChart()
        }
        else{
        	console.log('drawing column chart')
            drawColumnChart()
        }
    })

   	$('#articleList').bind("change",function(event){
   		$('#chartType option:first').prop("selected","selected")
   		$('#checkboxArea').html("")
   		showTop5Checkbox = false;
   		var obj = $('#articleList');
   		articleTitle = obj.find("option:selected").text()
   		title = {title:articleTitle}
   		//event.preventDefault();
   		if (articleTitle == 'Select Article'){
   			return
   		}
// after updating finishes, then show article information
        $.ajaxSettings.async = false;

   		$.getJSON('/revisions',title,function(result){
   		    alert(result['count']+' new revisions of '+title.title+' have been downloaded')
   		})
   		$.getJSON('/articles',title,function(result){
            Title = 'Title: '+ result['Title'];
            RevNum = 'Total number of revisions: '+ result['RevNum'];
   			top5 = result['top5'];
   			top5Text = 'Top 5 users: '+ result['top5'].join(", ")
   			$('#SelectedTitle').text(Title)
   			$('#SelectedRevisions').text(RevNum)
   			$('#SelectedTop5').text(top5Text)
   			articleData = result['result']
   		})
   	})
   	
   	$('#chartType').bind("change",function(event){
   		var obj = $('#chartType');
   		chart_name = obj.find("option:selected").text()
   		var obj_name = $('#articleList');
   		articleTitle = obj_name.find("option:selected").text()
   		event.preventDefault();
   		if (chart_name == 'Select Chart Type'){
   			return;
   		}
   		if (chart_name =="Bar Chart1"){
   			$('#checkboxArea').html("");
   			showTop5Checkbox = false;
   			drawColumnChart(articleTitle);
   		}
   		if (chart_name == "Pie Chart1"){
   			$('#checkboxArea').html("");
   			showTop5Checkbox = false;
   			drawPieChart(articleTitle);
   		}
   		if (chart_name == "Bar Chart2" && showTop5Checkbox == false){
   			for (var item in top5){
   	   			var checkbox = document.createElement('input');
   	   			checkbox.type = 'checkbox';
   	   			checkbox.value = top5[item];

   	   			var label = document.createElement('label');
   	   			label.innerHTML = top5[item];
   	   			
   	   			$('#checkboxArea').append(checkbox);
   	   			$('#checkboxArea').append(label);
   	   			$('#checkboxArea').append("<br />");
   			}
   			showTop5Checkbox = true;
   		}
   	})
   	
   	$('#submit').click(function(event){
   		var obj = $('#articleList');
   		articleTitle = obj.find("option:selected").text()
   		var selectedUser = new Array();
   		$('#checkboxArea :checked').each(function(){
   			selectedUser.push($(this).val());
   		})
   		if (selectedUser.length == 0){
   			alert('Please select at least one top5 user!')
   		}
   		else{
	   		event.preventDefault();
	   		req = {users:selectedUser,title:articleTitle}
	   		$.getJSON('/articles/top5',req,function(result){
	   			chart3Data = result
	   		})
	   		drawColumnChartTop5(selectedUser,articleTitle)
   		}
   	})

    $('#revNumBtn').click(function(event){
    	revNum = $('#revNumInput').val();
    	showMostRevs();
		showLeastRevs();
    })

    // input title to select an article
    $('#titleBtn').click(function(event){
        selectedTitle = $('#titleInput').val();
        req = {title:selectedTitle};
        $.getJSON('/revisions',req,function(result){
            alert(result['count']+' new revisions of '+req.title+' have been downloaded')
        })
    })

    // input author name to do author analytics
    $('#authorBtn').click(function(event){
        var author = $('#authorInput').val();
        $('#selectedAuthor').html("Author: "+author);
        req = {author:author};
        var articles = new Array();
        $.getJSON('/authors/author',req,function(result){
            for (var i=0;i<result.length;i++){
                if($.inArray(result[i]['_id']['title'], articles) == -1 ){
                    articles.push(result[i]['_id']['title']);
                }
            }
            for (var i=0;i<articles.length;i++) {
                var revNum =0;
                for (var j=0;j<result.length;j++) {
                    if (articles[i]==result[j]['_id']['title']){
                        revNum += 1;
                    }
                }
                var article = document.createElement('li');
                article.innerHTML = articles[i];
                var viewBtn = document.createElement('button');
                viewBtn.innerHTML = "View "+revNum+" revisions";
                viewBtn.name = articles[i];
                viewBtn.addEventListener("click", function (ev) {
                    var timestamps = new Array();
                    for (var k=0;k<result.length;k++) {
                        if (this.name==result[k]['_id']['title']){
                            timestamps.push(result[k]['_id']['timestamp'])
                        }
                    }
                    alert(timestamps);
                });
                $('#authorArticlesList').append(article);
                $('#authorArticlesList').append(viewBtn);
            }
        })
    })
});