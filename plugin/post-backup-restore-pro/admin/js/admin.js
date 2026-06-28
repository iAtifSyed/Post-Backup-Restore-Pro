/**
 * Post Backup & Restore Pro - WP Admin Scripts
 */

jQuery(document).ready(function($) {

	// Cache common selectors
	var $postsBody          = $('#pbrp-posts-list-body');
	var $exportBtn          = $('#pbrp-btn-execute-export');
	var $selectAllBtn       = $('#pbrp-select-all');
	var $selectNoneBtn      = $('#pbrp-select-none');
	var $mainCb             = $('#pbrp-main-cb');
	var $applyFiltersBtn    = $('#pbrp-btn-apply-filters');
	var $resetFiltersBtn    = $('#pbrp-btn-reset-filters');
	var $progressCard       = $('#pbrp-export-progress-card');
	var $progressBarFill    = $('.pbrp-progress-bar-fill');
	var $progressStatusText = $('.progress-status-text');
	var $progressPercent    = $('.progress-percent');
	var $successMessageBlock= $('#pbrp-export-success-message');

	// Drag and drop elements
	var $dropZone           = $('#pbrp-drag-drop-zone');
	var $fileInput          = $('#pbrp-file-input');
	var $browseBtn          = $('#pbrp-btn-browse');
	var $fileDetails        = $('#pbrp-import-file-details');
	var $previewCard        = $('#pbrp-import-preview-card');
	var $importProgressCard = $('#pbrp-import-progress-card');

	// Core state
	var selectedPostIds = [];

	/**
	 * 1. Post Selection and List Queries
	 */
	function loadPostsList() {
		$postsBody.html('<tr><td colspan="7" class="loading-td"><span class="spinner is-active"></span> ' + pbrp_vars.strings.import_loading + '</td></tr>');
		
		var checkedCategories = [];
		$('.pbrp-filter-category-cb:checked').each(function() {
			checkedCategories.push($(this).val());
		});

		var data = {
			action: 'pbrp_get_posts',
			nonce: pbrp_vars.nonce,
			search: $('#pbrp-filter-search').val(),
			category: checkedCategories.join(','),
			tag: $('#pbrp-filter-tag').val(),
			author: $('#pbrp-filter-author').val(),
			status: $('#pbrp-filter-status').val()
		};

		$.post(pbrp_vars.ajax_url, data, function(response) {
			if (response.success && response.data.posts) {
				var posts = response.data.posts;
				if (posts.length === 0) {
					$postsBody.html('<tr><td colspan="7" class="loading-td">No posts matched your filters. Try widening search terms!</td></tr>');
					$exportBtn.prop('disabled', true);
					return;
				}

				var html = '';
				$.each(posts, function(i, post) {
					var isChecked = $.inArray(post.id, selectedPostIds) !== -1 ? 'checked' : '';
					var statusBadge = post.status === 'publish' ? '<span class="post-state-badge badge-success">Published</span>' : '<span class="post-state-badge">' + post.status + '</span>';
					
					html += '<tr>';
					html += '<th class="check-column"><input type="checkbox" class="pbrp-post-cb" value="' + post.id + '" ' + isChecked + '></th>';
					html += '<td><strong>' + post.title + '</strong></td>';
					html += '<td><code>/' + post.slug + '</code></td>';
					html += '<td>' + (post.categories || '—') + '</td>';
					html += '<td>' + post.author + '</td>';
					html += '<td>' + post.date + '</td>';
					html += '<td>' + statusBadge + '</td>';
					html += '</tr>';
				});

				$postsBody.html(html);
				updateExportButtonStatus();
			} else {
				$postsBody.html('<tr><td colspan="7" class="loading-td text-danger">Failed to fetch posts.</td></tr>');
			}
		});
	}

	// Trigger initial posts list pull
	if ($postsBody.length > 0) {
		loadPostsList();
	}

	// Filtering Triggers
	$applyFiltersBtn.on('click', function() {
		loadPostsList();
	});

	// Select All / Clear All Categories
	$('#pbrp-cat-select-all').on('click', function(e) {
		e.preventDefault();
		$('.pbrp-filter-category-cb').prop('checked', true);
		loadPostsList();
	});

	$('#pbrp-cat-select-none').on('click', function(e) {
		e.preventDefault();
		$('.pbrp-filter-category-cb').prop('checked', false);
		loadPostsList();
	});

	// Re-trigger post loading on any category checkbox toggle
	$(document).on('change', '.pbrp-filter-category-cb', function() {
		loadPostsList();
	});

	$resetFiltersBtn.on('click', function() {
		$('#pbrp-filter-search').val('');
		$('.pbrp-filter-category-cb').prop('checked', false);
		$('#pbrp-filter-tag').val('');
		$('#pbrp-filter-author').val('');
		$('#pbrp-filter-status').val('any');
		selectedPostIds = [];
		$mainCb.prop('checked', false);
		loadPostsList();
	});

	// Checkbox change tracker
	$postsBody.on('change', '.pbrp-post-cb', function() {
		var id = parseInt($(this).val());
		if ($(this).is(':checked')) {
			if ($.inArray(id, selectedPostIds) === -1) {
				selectedPostIds.push(id);
			}
		} else {
			selectedPostIds = $.grep(selectedPostIds, function(value) {
				return value !== id;
			});
		}
		updateExportButtonStatus();
	});

	// Select All / Select None controls
	$selectAllBtn.on('click', function() {
		$('.pbrp-post-cb').prop('checked', true).trigger('change');
		$mainCb.prop('checked', true);
	});

	$selectNoneBtn.on('click', function() {
		$('.pbrp-post-cb').prop('checked', false).trigger('change');
		$mainCb.prop('checked', false);
		selectedPostIds = [];
		updateExportButtonStatus();
	});

	$mainCb.on('change', function() {
		var isChecked = $(this).is(':checked');
		$('.pbrp-post-cb').prop('checked', isChecked).trigger('change');
	});

	function updateExportButtonStatus() {
		if (selectedPostIds.length > 0) {
			$exportBtn.prop('disabled', false);
			$exportBtn.find('.pbrp-selected-count-badge').text('(' + selectedPostIds.length + ')');
		} else {
			$exportBtn.prop('disabled', true);
			$exportBtn.find('.pbrp-selected-count-badge').text('');
		}
	}

	/**
	 * 2. AJAX Backup / Export execution (Chunked progress)
	 */
	$exportBtn.on('click', function(e) {
		e.preventDefault();
		if (selectedPostIds.length === 0) return;

		// Disable button and show progress block
		$exportBtn.prop('disabled', true);
		$progressCard.slideDown();
		$successMessageBlock.hide();
		updateProgressBar(5, pbrp_vars.strings.starting);

		var data = {
			action: 'pbrp_start_export',
			nonce: pbrp_vars.nonce,
			post_ids: selectedPostIds
		};

		$.post(pbrp_vars.ajax_url, data, function(response) {
			if (response.success) {
				var token = response.data.token;
				var total = response.data.total_posts;
				
				// Simulate/process batch steps
				updateProgressBar(30, pbrp_vars.strings.processing.replace('{current}', '1').replace('{total}', '1'));
				
				setTimeout(function() {
					updateProgressBar(65, pbrp_vars.strings.compressing);
					
					// Call finalizer
					var finalData = {
						action: 'pbrp_finalize_export',
						nonce: pbrp_vars.nonce,
						token: token
					};

					$.post(pbrp_vars.ajax_url, finalData, function(finalResponse) {
						if (finalResponse.success) {
							updateProgressBar(100, pbrp_vars.strings.completed);
							$progressCard.find('.success-notice').html(
								'<strong>Success!</strong> ZIP generated containing ' + 
								finalResponse.data.posts_count + ' posts and ' + 
								finalResponse.data.images_count + ' media files (Size: ' + 
								finalResponse.data.size + ').'
							);
							$('#pbrp-btn-download-zip').attr('href', finalResponse.data.zip_url);
							$successMessageBlock.fadeIn();
						} else {
							showProgressError(finalResponse.data.message);
						}
					});
				}, 1500);

			} else {
				showProgressError(response.data.message);
			}
		});
	});

	function updateProgressBar(percent, text) {
		$progressBarFill.css('width', percent + '%');
		$progressPercent.text(percent + '%');
		$progressStatusText.text(text);
	}

	function showProgressError(errorText) {
		$progressBarFill.css('background-color', '#dc3232');
		$progressStatusText.addClass('text-danger').text(errorText || pbrp_vars.strings.error);
		$exportBtn.prop('disabled', false);
	}


	/**
	 * 3. Drag and Drop Uploader / File Import preview
	 */
	$browseBtn.on('click', function() {
		$fileInput.click();
	});

	$fileInput.on('change', function(e) {
		var file = e.target.files[0];
		handleUploadFile(file);
	});

	$dropZone.on('dragover', function(e) {
		e.preventDefault();
		$(this).addClass('dragover');
	});

	$dropZone.on('dragleave', function() {
		$(this).removeClass('dragover');
	});

	$dropZone.on('drop', function(e) {
		e.preventDefault();
		$(this).removeClass('dragover');
		var file = e.originalEvent.dataTransfer.files[0];
		handleUploadFile(file);
	});

	function handleUploadFile(file) {
		if (!file || file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
			alert(pbrp_vars.strings.invalid_zip);
			return;
		}

		$dropZone.hide();
		$fileDetails.find('.filename-text').text(file.name);
		$fileDetails.find('.filesize-text').text((file.size / (1024 * 1024)).toFixed(2) + ' MB');
		$fileDetails.show();

		// Run AJAX analysis of ZIP
		var formData = new FormData();
		formData.append('action', 'pbrp_preview_import');
		formData.append('nonce', pbrp_vars.nonce);
		formData.append('backup_zip', file);

		$previewCard.hide();
		$importProgressCard.show();
		updateImportProgress(20, pbrp_vars.strings.import_loading);

		$.ajax({
			url: pbrp_vars.ajax_url,
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {
				$importProgressCard.hide();
				if (response.success) {
					var p = response.data.preview;
					
					$previewCard.find('.posts-count-val').text(p.posts_count);
					$previewCard.find('.images-count-val').text(p.images_count);
					$previewCard.find('.authors-count-val').text(p.authors.length);
					$previewCard.find('.creator-version-text').text(p.version);
					$previewCard.find('.created-date-text').text(p.export_date);
					$previewCard.find('.categories-list-text').text(p.categories.join(', ') || '—');
					$previewCard.find('.tags-list-text').text(p.tags.join(', ') || '—');
					
					$previewCard.attr('data-import-token', response.data.import_token);
					$previewCard.slideDown();
				} else {
					alert(response.data.message);
					resetUploadWidget();
				}
			},
			error: function() {
				$importProgressCard.hide();
				alert('An upload processing error occurred.');
				resetUploadWidget();
			}
		});
	}

	$('#pbrp-btn-remove-file, #pbrp-btn-cancel-restore').on('click', function() {
		resetUploadWidget();
	});

	function resetUploadWidget() {
		$fileDetails.hide();
		$previewCard.hide();
		$importProgressCard.hide();
		$dropZone.show();
		$fileInput.val('');
	}

	function updateImportProgress(percent, text) {
		$importProgressCard.find('.pbrp-progress-bar-fill').css('width', percent + '%');
		$importProgressCard.find('.progress-percent').text(percent + '%');
		$importProgressCard.find('.progress-status-text').text(text);
	}

	/**
	 * 4. Execute Restore/Import operation
	 */
	$('#pbrp-btn-execute-restore').on('click', function(e) {
		e.preventDefault();
		var token = $previewCard.attr('data-import-token');
		if (!token) return;

		$previewCard.hide();
		$importProgressCard.show();
		updateImportProgress(10, 'Extracting backup package and auditing file-integrity paths...');

		var data = {
			action: 'pbrp_execute_restore',
			nonce: pbrp_vars.nonce,
			import_token: token,
			duplicate_strategy: $('#pbrp-import-duplicate').val(),
			import_strategy: $('#pbrp-import-strategy').val()
		};

		setTimeout(function() {
			updateImportProgress(45, 'Unpacking media folder assets and performing sideload processes...');
			
			setTimeout(function() {
				updateImportProgress(75, 'Creating category nodes, mapping tags, and writing post entries...');
				
				$.post(pbrp_vars.ajax_url, data, function(response) {
					if (response.success) {
						updateImportProgress(100, 'Restore complete!');
						var notice = '<strong>Success!</strong> Restored ' + response.data.imported + ' posts, updated ' + response.data.updated + ' posts, and safely processed ' + response.data.images + ' content images inside the media directory (Duration: ' + response.data.duration + ').';
						$importProgressCard.find('.success-notice').html(notice);
						$('#pbrp-import-success-message').fadeIn();
					} else {
						showImportError(response.data.message);
					}
				});
			}, 1200);
		}, 1000);
	});

	function showImportError(text) {
		$importProgressCard.find('.pbrp-progress-bar-fill').css('background-color', '#dc3232');
		$importProgressCard.find('.progress-status-text').addClass('text-danger').text(text || 'Restore aborted due to an error.');
	}


	/**
	 * 5. Plugin Settings Form Save (AJAX)
	 */
	$('#pbrp-settings-form').on('submit', function(e) {
		e.preventDefault();
		var $form = $(this);
		var $btn = $('#pbrp-btn-save-settings');

		$btn.prop('disabled', true).text('Saving Settings...');

		var data = $form.serialize() + '&action=pbrp_save_settings&nonce=' + pbrp_vars.nonce;

		$.post(pbrp_vars.ajax_url, data, function(response) {
			$btn.prop('disabled', false).text('Save Settings');
			if (response.success) {
				// Show standard WP notices bar
				var $notice = $('<div class="notice notice-success is-dismissible"><p>' + response.data.message + '</p></div>');
				$('.pbrp-card').first().before($notice);
				setTimeout(function() {
					$notice.fadeOut(function() { $(this).remove(); });
				}, 4000);
			} else {
				alert(response.data.message || 'Error saving settings.');
			}
		});
	});

	// Toggle Password Block on Advanced Encryption toggle select
	$('#pbrp-aes-encryption').on('change', function() {
		if ($(this).val() === 'yes') {
			$('#encryption-password-field').slideDown();
		} else {
			$('#encryption-password-field').slideUp();
			$('#pbrp-encryption-key').val('');
		}
	});


	/**
	 * 6. Logger Panel Commands
	 */
	$('#pbrp-btn-clear-logs').on('click', function() {
		if (confirm(pbrp_vars.strings.confirm_clear)) {
			var data = {
				action: 'pbrp_clear_logs',
				nonce: pbrp_vars.nonce
			};

			$.post(pbrp_vars.ajax_url, data, function(response) {
				if (response.success) {
					$('#pbrp-logs-terminal').html('<p class="terminal-empty">[SYSTEM] Logs flushed successfully.</p>');
					$('#pbrp-btn-clear-logs').prop('disabled', true);
				}
			});
		}
	});

});
