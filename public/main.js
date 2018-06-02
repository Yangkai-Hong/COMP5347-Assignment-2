google.charts.load('current', {packages: ['corechart']});

var overallData
var articleData
var chart3Data
var showTop5Checkbox = false;
var top5
var articleTitle

function showOverall() {
    $.getJSON('/mostRevisions',{num:3},function (result) {
        for (i = 0; i < 3; i++) {
            var li = document.createElement('li');
            li.innerHTML = result[i]['_id'];
            $('#mostRevs').append(li);
        }
    })
    $.getJSON('/leastRevisions',{num:3},function (result) {
        for (i = 0; i < 3; i++) {
            var li = document.createElement('li');
            li.innerHTML = result[i]['_id'];
            $('#leastRevs').append(li);
        }
    })
    $.getJSON('/largestGroup',function (result) {
            var p = document.createElement('p');
            p.innerHTML = result[0]['_id'];
            $('#largeGp').append(p);
    })
    $.getJSON('/smallestGroup',function (result) {
        var p = document.createElement('p');
        p.innerHTML = result[0]['_id'];
        $('#smallGp').append(p);
    })
    $.getJSON('/shortestHistory',function (result) {
        var p = document.createElement('p');
        p.innerHTML = result[0]['_id'];
        $('#shortHis').append(p);
    })
    $.getJSON('/longestHistory',function (result) {
        for (i = 0; i < 3; i++) {
            var li = document.createElement('li');
            li.innerHTML = result[i]['_id'];
            $('#longHis').append(li);
        }
    })
}
// draw google charts
function drawColumnChart(title){
    var option = {'title':'Revision number distribution by year and by user type',
                  'width':1000,
                  'height':600};
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
        option['title'] += ' for article ';
        option['title'] +=  title;
        $.each(articleData,function (index, val) {
            graphData.addRow([val['year'],val['admin'],val['anon'],val['bot'],val['user']]);
        })
        var chart = new google.visualization.ColumnChart($('#IndividualChart')[0]);
        console.log("drawing bar chart for an article")
    }
    chart.draw(graphData, option);
}

function drawPieChart(title){
    var option = {'title':'Revision number distribution by user type',
                  'width':1000,
                  'height':600,
                  'is3D':true};
	var adminNum = 0;
	var anonNum = 0;
 	var botNum = 0;
	var userNum = 0;
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
    var option = {'title':'Revision number distribution by user type',
                  'width':1000,
                  'height':600};
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string','year');
	for (i=0;i<users.length;i++){
	    graphData.addColumn('number',users[i]);
        option['title'] += (users[i]+', ')
    }
	option['title'] += ' for article '
	option['title'] += title
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

function updateSelectedArticle() {
    //add new revisions first
    $.getJSON('/articles/article/revisions', req, function (result) {
        $('#alert').html("");
        var alert1 = document.createElement('div');
        alert1.setAttribute("class", "alert alert-success alert-dismissable");
        var alert2 = document.createElement('button');
        alert2.setAttribute("class", "close");
        alert2.setAttribute("data-dismiss", "alert");
        alert2.innerHTML = "&times";
        if (result['count']>0) {
            alert1.innerText = 'Update ' + result['count'] + ' revisions of ' + req.title;
        }
        else {
            alert1.innerText = 'Already up-to-date';
        }
        alert1.appendChild(alert2);
        $('#alert').append(alert1);
    })
    //then update usertypes(bot,admin)
    $.get('/');
}

function getSelectedArticle(){
    $.getJSON('/articles/article',req,function(result){
        Title = result['Title'];
        RevNum = result['RevNum'];
        top5 = result['top5'];
        top5Text = result['top5'].join(", ")
        $('#SelectedTitle').text(Title)
        $('#SelectedRevisions').text(RevNum)
        $('#SelectedTop5').text(top5Text)
        articleData = result['result']
    })
}
//************************************************************
//************************************************************
//************************************************************



$(document).ready(function() {
    // side navigation
    $("#sideNav").affix({offset:{top:150}});
    $("#submit").hide();

    //show overall analytics
	showOverall();

	//change number of most/least revisions displaying
    $('#revNumInput').click(function (e) {
        event.preventDefault();
        $('#revNumInput').popover('hide');
    })
    $('#revNumBtn').click(function(event){
        var revNum = parseInt($('#revNumInput').val());
        if (revNum < 1 || isNaN(revNum)==true){
            $('#revNumInput').popover('show');
        }
        else {
            $('#revNumInput').popover('hide');
            $.getJSON('/mostRevisions', {num: revNum}, function (result) {
                $('#mostRevs').html('');
                for (i = 0; i < revNum; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = result[i]['_id'];
                    $('#mostRevs').append(li);
                }
            })
            $.getJSON('/leastRevisions', {num: revNum}, function (result) {
                $('#leastRevs').html('');
                for (i = 0; i < revNum; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = result[i]['_id'];
                    $('#leastRevs').append(li);
                }
            })
        }
    })

    //draw overall charts
    $('#chartList').bind("change",function(event){
        var obj = $('#chartList');
        chartType = obj.find("option:selected").val();
        //console.log(chartType);
        event.preventDefault();
        if(chartType == -1){
            return
        }
        else{
            //get overall data for charts
            $.ajaxSettings.async = false;
            $.getJSON('/overallChartData',function (result) {
                overallData = result;
            })
            $.ajaxSettings.async = true;
            if (chartType == 1){
                console.log('drawing pie chart')
                drawPieChart()
            }
            else if(chartType == 0){
                console.log('drawing column chart')
                drawColumnChart()
            }
        }
    })

    //get articles list
	var articlesArray
    $.getJSON('/articles',function(result) {
        articlesArray = new Array();
        for (i=0;i<result.length;i++) {
            var option = document.createElement('option');
            var text = result[i]['_id'] + ' (' + result[i]['numOfEdits'] + ' revisions)';
            var title = result[i]['_id'];
            option.innerHTML = text;
            option.value = title;
            $('#articleList').append(option);
            articlesArray.push(title);
        }
        $("#titleInput").autocomplete({
            source: articlesArray
        });
    });

    //show selected article's data
    $('#articleList').bind("change",function(event){
        $('#chartType option:first').prop("selected","selected")
        $('#checkboxArea').html("")
        showTop5Checkbox = false;
        var obj = $('#articleList');
        var articleTitle = obj.find("option:selected").val();
        //console.log(articleTitle);
        req = {title:articleTitle}
        //event.preventDefault();
        if (articleTitle == 'Select Article'){
            return
        }
        // ONLY after updating finishes, then show article information
        $.ajaxSettings.async = false;
        updateSelectedArticle();
        getSelectedArticle();
        $.ajaxSettings.async = true;
    })
    // input title to select an article
    $('#titleBtn').click(function(event){
        var title = $('#titleInput').val();
        req = {title:title};

        $.ajaxSettings.async = false;
        updateSelectedArticle();
        getSelectedArticle();
        $.ajaxSettings.async = true;
    });

    // draw article charts
    $('#chartType').bind("change",function(event){
        var obj = $('#chartType');
        chartType = obj.find("option:selected").val()
        articleTitle = $("#SelectedTitle").html();
        //console.log(articleTitle);
        event.preventDefault();
        if (chartType == -1){
            return;
            $('#submit').hide();
        }
        else if (chartType == 0){
            $('#checkboxArea').html("");
            showTop5Checkbox = false;
            drawColumnChart(articleTitle);
            $('#submit').hide();
        }
        else if (chartType == 1){
            $('#checkboxArea').html("");
            showTop5Checkbox = false;
            drawPieChart(articleTitle);
            $('#submit').hide();
        }
        else if (chartType == 2 && showTop5Checkbox == false){
            $('#checkboxArea').html('');
            for (var item in top5){
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = top5[item];

                var label = document.createElement('label');
                label.setAttribute('class','checkbox-inline');

                label.appendChild(checkbox);
                label.innerHTML += top5[item];

                var area = document.getElementById('checkboxArea');
                area.appendChild(label);
            }
            $('#submit').show();

            showTop5Checkbox = true;
        }
    })

    //draw article top5 charts
    $('#submit').click(function(event){
        articleTitle = $("#SelectedTitle").text();
        var selectedUser = new Array();
        $('#checkboxArea :checked').each(function(){
            selectedUser.push($(this).val());
        })
        if (selectedUser.length == 0){
            alert('Please select at least one top5 user!');
        }
        else{
            event.preventDefault();
            req = {users:selectedUser,title:articleTitle}

            $.ajaxSettings.async = false;
            $.getJSON('/articles/article/top5',req,function(result){
                chart3Data = result
            })
            $.ajaxSettings.async = true ;
            drawColumnChartTop5(selectedUser,articleTitle)
        }
    })

    //get unique authors list
    var authorsArray
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

    // input author name to do author analytics
    $('#authorBtn').click(function(event){
        $('#accordion').html("");

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
                var article7 = document.createElement('ul');
                for (var j=0;j<result.length;j++) {
                    if (articles[i]==result[j]['_id']['title']){
                        revNum += 1;
                        var li = document.createElement('li');
                        li.innerHTML = result[j]['_id']['timestamp'];
                        article7.appendChild(li);
                    }
                }
                /*
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion"href="#collapseOne">
                                title
                            </a>
                        </h4>
                    </div>
                    <div id="collapseOne" class="panel-collapse collapse in">
                        <div class="panel-body">
                            detailed timestamps
                        </div>
                    </div>
                </div>
                */
                var article1 = document.createElement('div');
                article1.classList.add("panel");
                article1.classList.add("panel-success");
                //console.log(article.className);
                var article2 = document.createElement('div');
                article2.classList.add("panel-heading");
                article1.appendChild(article2);
                var article3 = document.createElement('h4');
                article3.classList.add("panel-title");
                article2.appendChild(article3);
                var article4 = document.createElement('a');
                article4.setAttribute("data-toggle","collapse");
                article4.setAttribute("data-parent","#accordion");
                article4.setAttribute("href","#"+i);
                article4.innerText = articles[i] + " (" + revNum + " revisions)";
                article3.appendChild(article4);
                var article5 = document.createElement('div');
                article5.setAttribute("id",i);
                article5.setAttribute("class","panel-collapse collapse");
                article1.appendChild(article5);
                var article6 = document.createElement('div');
                article6.setAttribute("class","panel-body");
                article5.appendChild(article6);

                article6.appendChild(article7);

                var article = document.getElementById("accordion");
                article.appendChild(article1);

            }
        })
    })
});