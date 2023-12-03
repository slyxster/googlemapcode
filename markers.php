function populateMapMarkers() {
	
	$output = "";
		$output .= '<div id="markermap">';
	
			// Replace POSTTYPE with actual posttype created
			$args = array( 'post_type' => 'POSTTYPE', 'posts_per_page' => -1, 'order_by' => 'menu_order', 'order' => 'asc' );
				$the_query = new WP_Query( $args );

				if ( $the_query->have_posts() ) {

                    $ctr = 1;

					while ( $the_query->have_posts() ) {
						$the_query->the_post();

						$id = get_the_ID();
						$name = get_the_title($id);
						$featured_img_url = get_the_post_thumbnail_url($id,'full'); 
						$link = get_permalink($id);

            // These two fields place the actual markers on map
						$lat = get_field('loc_lat', $id);
						$long = get_field('loc_long', $id);
						
						$address = get_field('street_address', $id);
						$city = get_field('city', $id);
						$zip = get_field('zip_code', $id);

            // If latitude is empty skip record.
						if ( empty($lat) ) { continue; }

						$urgentclass = "";
						$urgentcareflag = get_field('offers_urgent_care', $id);
						$covidflag = get_field('offers_covid_services', $id);

					
						$output .= '<div class="marker" data-markerid="'.$ctr.'" data-lat="'.$lat.'" data-long="'.$long.'" data-markertype="POSTTYPE" >';
								// Inner content is for the info box
								$output .= '<div class="innercontent">';
									$output .= '<span class="close"><i class="fa-solid fa-xmark"></i></span>';

								if ($urgentcare == 1) {
									$output .= '<h5><i class="fa-sharp fa-solid fa-star-of-life"></i> Urgent Care Services </h5>';
								}

								$output .= "<h3>".$name."</h3>";
								$output .= '<p class="address">' . $address . "<br>" . $city . ", FL " . $zip . "</p>";
							$output .= '</div>';

						$ctr++;
						
					}
				}
	
		$output .= '</div>';
		
	return $output;
}

add_shortcode('show_map', 'populateMapMarkers');
