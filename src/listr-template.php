<!DOCTYPE html>
<html>
<head>
<?=$header?>
</head>
<body<?=$direction?>>
  <div class="container">
<?=$breadcrumbs?>
<?=$responsive_open?>
      <table id="bs-table" class="table <?=$options['bootstrap']['table_style']?>">
        <thead>
          <tr>
<?=$table_header?>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td colspan="<?=$table_count+1?>">
              <small class="pull-<?=$$left?> text-muted" dir="ltr"><?=$contained?></small>
              <?=$kudos?>
            </td>
          </tr>
        </tfoot>
        <tbody>
<?=$table_body?>
        </tbody>                          
      </table>
<?=$responsive_close?>
<? if ($options['general']['enable_viewer']) { ?>
    <div class="modal fade" id="viewer-modal" tabindex="-1" role="dialog" aria-labelledby="file-name" aria-hidden="true">
      <div class="modal-dialog <?=$options['bootstrap']['modal_size']?>">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close pull-<?=$right?>" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title pull-<?=$left?>" id="file-name">&nbsp;</h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
<? if (($options['cdn']['highlight_js']) && ($options['cdn']['highlight_css'])) { ?>
            <button type="button" class="btn btn-link highlight hidden pull-<?=$left?>"><?=_('Apply code highlighting')?></button>
<? } ?>
            <button type="button" class="btn btn-default" data-dismiss="modal"><?=_('Close')?></button>
<? if ($options['general']['share_button']) { ?>
            <div class="btn-group">
              <a class="btn btn-primary fullview"></a>
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu" role="menu">
<? if ($options['keys']['dropbox_app']) { ?>
                <li><a class="save-dropbox">Save to Dropbox</a></li>
                <li class="divider"></li>
<? } ?>
                <li><a class="email-link">Email</a></li>
                <li><a class="facebook-link">Facebook</a></li>
                <li><a class="google-link">Google+</a></li>
                <li><a class="twitter-link">Twitter</a></li>
              </ul>
            </div>
<? } else { ?>
            <a class="btn btn-primary fullview"></a>
<? } ?>
          </div>
        </div>
      </div>
    </div>
<? } ?>
  </div>
<?=$footer?>
</body>
</html>