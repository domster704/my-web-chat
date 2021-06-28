async function addMessage(from, content) {
    let cardSide = 'left';
    if (from == myName)
        cardSide = 'right';
        
    $(".allMes").append(`
        <div class="card ${cardSide}Card mesCard" style="padding: 10px;">
            <h3 class="card-subtitle text-muted mesText">${content}</h3>
        </div>`);
    
    currentMessageSize++;
}

const checkingDelay = 2000

function readNewMessages() {
    $.ajax({
        type: 'POST',
        url: '/getNewMessage',
        data: {
            'from': myName,
            'messagesSize': currentMessageSize,
            'to': currentUser
        },
        success: async (data) => {
            if (data.length != 0 && data != 'similar') {
                console.log(data)
                try {
                    clearInterval(handler)
                    await addMessage(data[0][1], data[0][0])
                    setInterval(handler, checkingDelay)
                    $('.allMes').scrollTop($('.allMes')[0].scrollHeight);
                } catch(e) { 
                    console.log(e);
                    setInterval(handler, checkingDelay)
                }
            }
        },
        error: null
    });
}