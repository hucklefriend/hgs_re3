function filterAdminLinkList()
{
    $('#admin-link-list-filter').val().toLowerCase().trim().split(/\s+/).forEach((filterText) => {
        $('#admin-link-list').children().each((index, element) => {
            const linkText = $(element).text().toLowerCase();
            if (linkText.includes(filterText)) {
                $(element).show();
            } else {
                $(element).hide();
            }
        });
    });
}

$(()=>{
    let adminLinkListFilter = $('#admin-link-list-filter');
    let adminLinkListFilterTimer = null;
    adminLinkListFilter.on('input', function (e) {
        if (adminLinkListFilterTimer !== null) {
            clearTimeout(adminLinkListFilterTimer);
        }

        adminLinkListFilterTimer = setTimeout(() => {
            adminLinkListFilterTimer = null;
            filterAdminLinkList();
        }, 500);
    });

    // $('.admin-link-list-filter')が1つあれば実行
    if (adminLinkListFilter.length > 0) {
        filterAdminLinkList();
    }


    let adminLinkPlatformFilter = $('#admin-link-platform-filter');
    if (adminLinkPlatformFilter.length > 0) {
        adminLinkPlatformFilter.select2({placeholder: "プラットフォーム"});
        adminLinkPlatformFilter.on('change', function (e) {
            let selectedIds = adminLinkPlatformFilter.val();

            // selectedIdsでループ
            if (selectedIds) {
                $('.list-group-item').hide();
                selectedIds.forEach(function(value) {
                    $('.list-group-item[data-platform="' + value + '"]').show();
                });
            } else {
                $('.list-group-item').show();
            }
        });
    }

    $('textarea').each(function (){
        $(this).on('input', function() {
            setTextareaHeight(this);
        });

        setTextareaHeight(this);
    });

    // テキストエリアの高さを自動調整
    function setTextareaHeight(e)
    {
        let elem = $(e);
        const height = e.scrollHeight;
        const clientHeight = e.clientHeight;
        if (clientHeight < height && height < 400) {
            elem.css('height', (height + 5) + 'px');
        }
    }

    $('.description-source-tool-a').click(function(e) {
        e.preventDefault();
        $('#description_source').val('<a href="" target="_blank"></a>');
    });

    $('.description-source-tool-a-shop').click(function(e) {
        e.preventDefault();
        $('#description_source').val('<a href="" target="_blank"><i class="bi bi-shop"></i></a>');
    });
});


function descriptionFormat(type, name)
{
    let format = '';
    switch (type) {
        case 'wikipedia':
            format = '<a href="" target="_blank">「」ウィキペディア日本語版()</a>';
            break;
    }

    $('#' + name).val(format);
}

function clipboardCopy(text)
{
    navigator.clipboard.writeText(text);
}
