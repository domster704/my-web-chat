function addMessage(from, content) {
    let cardSide = 'left';
    if (from == myName)
        cardSide = 'right';
        
    $(".allMes").append(`
        <div class="card ${cardSide}Card mesCard" style="padding: 10px;">
            <h3 class="card-subtitle text-muted mesText">${content}</h3>
        </div>`);
    currentMessageSize++;
}

function readNewMessages() {
    $.ajax({
        type: 'POST',
        url: '/api/getNewMessage',
        data: {
            from: myName,
            messagesSize: currentMessageSize,
            to: currentUser
        },
        success: (value) => {
            const data = value.data
            if (data != 'similar') {
                addMessage(data[0].fromWho, data[0].content)
                $('.allMes').scrollTop($('.allMes')[0].scrollHeight);
            }
        },
        error: (err) => {throw err}
    });
}