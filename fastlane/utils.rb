def load_build_metadata(opts)
    package = load_json(json_path: './package.json')
    build_id = ENV['AZURE_UNIQUE_BUILD_ID']

    if build_id.nil? || build_id.empty?
        puts "Required environment variable 'AZURE_UNIQUE_BUILD_ID' not found. Got: #{build_id}"
        exit(1)
    end

    app_version = package['version']
    build_number = build_id.gsub('.', '') # We expect a date format like 20211122.6 here and trim the dot

    # Return a hashmap with all version metadata we could be interested in
    {
        'build_number' => build_number,
        'app_version' => app_version,
        'full_version' => "#{app_version}#{opts[:suffix] || ''}.#{build_number}"
    }
end