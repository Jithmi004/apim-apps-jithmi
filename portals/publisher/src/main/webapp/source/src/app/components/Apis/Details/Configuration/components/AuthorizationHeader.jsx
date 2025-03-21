/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { FormattedMessage } from 'react-intl';
import { isRestricted } from 'AppData/AuthManager';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import APIValidation from 'AppData/APIValidation';

/**
 *
 *
 * @export
 * @param {*} props
 * @returns
 */

export default function AuthorizationHeader(props) {
    const { api, configDispatcher, oauth2Enabled} = props;
    const [apiFromContext] = useAPI();
    const [isHeaderNameValid, setIsHeaderNameValid] = useState(true);
    const authorizationHeaderValue = api.authorizationHeader;

    function validateHeader(value) {
        const headerValidity = APIValidation.authorizationHeader.required()
            .validate(value, { abortEarly: false }).error;
        if (headerValidity === null) {
            setIsHeaderNameValid(true);
            configDispatcher({ action: 'saveButtonDisabled', value: false });
        } else {
            setIsHeaderNameValid(false);
            configDispatcher({ action: 'saveButtonDisabled', value: true });
        }
    }

    return (
        <Grid container spacing={1} alignItems='center'>
            <Grid item xs={11}>
                <TextField
                    disabled={isRestricted(['apim:api_create'], apiFromContext) || !oauth2Enabled}
                    id='outlined-name'
                    label={(
                        <FormattedMessage
                            id='Apis.Details.Configuration.Configuration.auth.header.label'
                            defaultMessage='Authorization Header'
                        />
                    )}
                    value={authorizationHeaderValue}
                    error={!isHeaderNameValid}
                    helperText={
                        (!isHeaderNameValid)
                        && (
                            <FormattedMessage
                                id='Apis.Details.Configuration.AuthHeader.helper.text'
                                defaultMessage='Authorization header name cannot contain spaces or special characters'
                            />
                        )
                    }
                    InputProps={{
                        id: 'itest-id-headerName-input',
                        onBlur: ({ target: { value } }) => {
                            if (value.trim() === '' ) {
                                configDispatcher({ action: 'authorizationHeader', value: 'Authorization' });
                            } else{
                                validateHeader(value);
                            }

                        },
                    }}
                    margin='normal'
                    variant='outlined'
                    onChange={({ target: { value } }) => configDispatcher({
                        action: 'authorizationHeader',
                        value
                    })}
                    style={{ display: 'flex' }}
                />
            </Grid>
            <Grid item xs={1}>
                <Tooltip
                    title={(
                        <FormattedMessage
                            id='Apis.Details.Configuration.Configuration.AuthHeader.tooltip'
                            defaultMessage={
                                ' The header name that is used to send the authorization '
                                + 'information. "Authorization" is the default header.'
                            }
                        />
                    )}
                    aria-label='Auth Header'
                    placement='right-end'
                    interactive
                >
                    <HelpOutline />
                </Tooltip>
            </Grid>
        </Grid>
    );
}

AuthorizationHeader.propTypes = {
    api: PropTypes.shape({
        authorizationHeader: PropTypes.string,
    }).isRequired,
    configDispatcher: PropTypes.func.isRequired,
    oauth2Enabled: PropTypes.bool.isRequired,
};
