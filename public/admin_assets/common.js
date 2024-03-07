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
});
